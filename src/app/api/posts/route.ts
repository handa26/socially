import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "@/actions/user.action";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const cursor = searchParams.get("cursor");
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		const userId = await getDbUserId();

		if (!userId) {
			const posts = await prisma.post.findMany({
				where: {
					isRepost: false,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: limit + 1,
				skip: cursor ? 1 : 0,
				cursor: cursor ? { id: cursor } : undefined,
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
							createdAt: true,
							comment: true,
							user: {
								select: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					saves: {
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

			const hasMore = posts.length > limit;
			const items = hasMore ? posts.slice(0, -1) : posts;
			const nextCursor = hasMore ? items[items.length - 1]?.id : null;

			return NextResponse.json({
				posts: items,
				nextCursor,
				hasMore,
				total: items.length,
			});
		}

		// Get followed users
		const followedUsers = await prisma.follows.findMany({
			where: {
				followerId: userId,
			},
			select: {
				followingId: true,
			},
		});

		const followedUserIds = followedUsers.map((follow) => follow.followingId);
		const userAndFollowedIds = [...followedUserIds, userId];

		// Get original posts from followed users
		const posts = await prisma.post.findMany({
			where: {
				authorId: {
					in: userAndFollowedIds,
				},
				isRepost: false,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
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
						createdAt: true,
						comment: true,
						user: {
							select: {
								id: true,
								name: true,
								username: true,
								image: true,
							},
						},
					},
				},
				saves: {
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

		// Get reposts from followed users
		const reposts = await prisma.repost.findMany({
			where: {
				userId: {
					in: followedUserIds,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			include: {
				post: {
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
								createdAt: true,
								comment: true,
								user: {
									select: {
										id: true,
										name: true,
										username: true,
										image: true,
									},
								},
							},
						},
						saves: {
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
				},
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						image: true,
					},
				},
			},
		});

		// Transform reposts to match post structure
		const transformedReposts = reposts.map((repost) => ({
			...repost.post,
			isRepost: true,
			repostedBy: repost.user,
			repostedAt: repost.createdAt,
			repostComment: repost.comment,
			feedAuthor: repost.user,
			originalAuthor: repost.post.author,
			_repostId: repost.id,
		}));

		// Combine and sort
		const allItems = [
			...posts.map((post) => ({
				...post,
				isRepost: false,
				feedAuthor: post.author,
				originalAuthor: post.author,
			})),
			...transformedReposts,
		];

		allItems.sort((a, b) => {
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);
			return dateB.getTime() - dateA.getTime();
		});

		// Apply cursor-based pagination to the combined feed
		let startIndex = 0;
		if (cursor) {
			const cursorIndex = allItems.findIndex((item) => item.id === cursor);
			if (cursorIndex !== -1) {
				startIndex = cursorIndex + 1;
			}
		}

		const paginatedItems = allItems.slice(startIndex, startIndex + limit + 1);
		const hasMore = paginatedItems.length > limit;
		const items = hasMore ? paginatedItems.slice(0, -1) : paginatedItems;
		const nextCursor = hasMore ? items[items.length - 1]?.id : null;

		return NextResponse.json({
			posts: items,
			nextCursor,
			hasMore,
			total: allItems.length,
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 },
		);
	}
}
