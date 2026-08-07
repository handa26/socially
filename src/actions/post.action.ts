"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function createPost(data: {
	content: string;
	mediaUrl?: string | null;
	mediaType?: "image" | "video" | "gif" | null;
	isSensitive?: boolean;
	aspectRatio?: string;
}) {
	try {
		const userId = await getDbUserId();
		if (!userId) throw new Error("Unauthorized");

		const post = await prisma.post.create({
			data: {
				content: data.content,
				mediaUrl: data.mediaUrl,
				mediaType: data.mediaType,
				isSensitive: data.isSensitive || false,
				aspectRatio: data.aspectRatio || "original",
				authorId: userId,
				// Legacy fields for backward compatibility
				image: data.mediaType === "image" ? data.mediaUrl : null,
				video: data.mediaType === "video" ? data.mediaUrl : null,
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		revalidatePath("/");
		return { success: true, post };
	} catch (error) {
		console.error("Error creating post:", error);
		return { success: false, error: "Failed to create post" };
	}
}

export async function repostPost(postId: string, comment?: string) {
	try {
		const userId = await getDbUserId();
		if (!userId) throw new Error("Unauthorized");

		// Check if already reposted
		const existingRepost = await prisma.repost.findUnique({
			where: {
				userId_postId: {
					userId,
					postId: postId,
				},
			},
		});

		if (existingRepost) {
			// Un-repost (remove repost)
			await prisma.repost.delete({
				where: {
					userId_postId: {
						userId,
						postId: postId,
					},
				},
			});

			revalidatePath("/");
			return { success: true, action: "unreposted" };
		}

		// Create repost
		const repost = await prisma.repost.create({
			data: {
				userId,
				postId: postId,
				comment: comment,
			},
		});

		// Create notification for original post author
		const originalPost = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});

		if (originalPost && originalPost.authorId !== userId) {
			await prisma.notification.create({
				data: {
					userId: originalPost.authorId,
					creatorId: userId,
					type: "REPOST",
					postId: postId,
				},
			});
		}

		revalidatePath("/");
		return { success: true, action: "reposted", repost };
	} catch (error) {
		console.error("Error reposting:", error);
		return { success: false, error: "Failed to repost" };
	}
}

export async function savePost(postId: string) {
	try {
		const userId = await getDbUserId();
		if (!userId) throw new Error("Unauthorized");

		// Check if already saved
		const existingSave = await prisma.save.findUnique({
			where: {
				userId_postId: {
					userId,
					postId: postId,
				},
			},
		});

		if (existingSave) {
			// Unsave
			await prisma.save.delete({
				where: {
					userId_postId: {
						userId,
						postId: postId,
					},
				},
			});
			revalidatePath("/");
			return { success: true, action: "unsaved" };
		}

		// Save post
		await prisma.save.create({
			data: {
				userId,
				postId: postId,
			},
		});

		revalidatePath("/");
		return { success: true, action: "saved" };
	} catch (error) {
		console.error("Error saving post:", error);
		return { success: false, error: "Failed to save post" };
	}
}

export async function getPosts() {
	try {
		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
						username: true,
					},
				},
				comments: {
					include: {
						author: {
							select: {
								id: true,
								username: true,
								image: true,
								name: true,
							},
						},
					},
					orderBy: {
						createdAt: "asc",
					},
				},
				likes: {
					select: {
						userId: true,
					},
				},
				reposts: {
					select: {
						userId: true,
					}
				},
				_count: {
					select: {
						likes: true,
						comments: true,
						reposts: true,
					},
				},
			},
		});

		return posts;
	} catch (error) {
		console.log("Failed to get posts", error);
		throw new Error("Failed to get posts");
	}
}

export async function toggleLike(postId: string) {
	try {
		const userId = await getDbUserId();
		if (!userId) return;

		// check if like exists
		const existingLike = await prisma.like.findUnique({
			where: {
				userId_postId: {
					userId,
					postId,
				},
			},
		});

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});

		if (!post) throw new Error("Post not found");

		if (existingLike) {
			// unlike
			await prisma.$transaction([
				prisma.like.delete({
					where: {
						userId_postId: {
							userId,
							postId,
						},
					},
				}),
				...(post.authorId !== userId
					? [
							prisma.notification.deleteMany({
								where: {
									type: "LIKE",
									userId: post.authorId, // recipient (post author)
									creatorId: userId, // person who liked
									postId,
								},
							}),
						]
					: []),
			]);
		} else {
			// like and create notification (only if liking someone else's post)
			await prisma.$transaction([
				prisma.like.create({
					data: {
						userId,
						postId,
					},
				}),
				...(post.authorId !== userId
					? [
							prisma.notification.create({
								data: {
									type: "LIKE",
									userId: post.authorId, // recipient (post author)
									creatorId: userId, // person who liked
									postId,
								},
							}),
						]
					: []),
			]);
		}

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Failed to toggle like:", error);
		return { success: false, error: "Failed to toggle like" };
	}
}

export async function createComment(postId: string, content: string) {
	try {
		const userId = await getDbUserId();

		if (!userId) return;
		if (!content) throw new Error("Content is required");

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});

		if (!post) throw new Error("Post not found");

		// Create comment and notification in a transaction
		const [comment] = await prisma.$transaction(async (tx) => {
			// Create comment first
			const newComment = await tx.comment.create({
				data: {
					content,
					authorId: userId,
					postId,
				},
			});

			// Create notification if commenting on someone else's post
			if (post.authorId !== userId) {
				await tx.notification.create({
					data: {
						type: "COMMENT",
						userId: post.authorId,
						creatorId: userId,
						postId,
						commentId: newComment.id,
					},
				});
			}

			return [newComment];
		});

		revalidatePath(`/`);
		return { success: true, comment };
	} catch (error) {
		console.error("Failed to create comment:", error);
		return { success: false, error: "Failed to create comment" };
	}
}

export async function deletePost(postId: string) {
	try {
		const userId = await getDbUserId();

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});

		if (!post) throw new Error("Post not found");
		if (post.authorId !== userId)
			throw new Error("Unauthorized - no delete permission");

		await prisma.post.delete({
			where: { id: postId },
		});

		revalidatePath("/"); // purge the cache
		return { success: true };
	} catch (error) {
		console.error("Failed to delete post:", error);
		return { success: false, error: "Failed to delete post" };
	}
}

export async function getPostById(postId: string) {
	try {
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
						username: true,
					},
				},
				comments: {
					include: {
						author: {
							select: {
								id: true,
								username: true,
								image: true,
								name: true,
							},
						},
					},
					orderBy: {
						createdAt: "asc",
					},
				},
				likes: {
					select: {
						userId: true,
					},
				},
				reposts: {
					select: {
						userId: true,
					},
				},
				_count: {
					select: {
						likes: true,
						comments: true,
						reposts: true,
					},
				},
			},
		});

		return post;
	} catch (error) {
		console.log("Failed to get post", error);
		throw new Error("Failed to get post");
	}
}

export async function getCommentById(commentId: string) {
	try {
		const userId = await getDbUserId();
		if (!userId) return;

		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		});

		return comment;
	} catch (error) {
		console.log("Failed to get comment", error);
		throw new Error("Failed to get comment");
	}
}
