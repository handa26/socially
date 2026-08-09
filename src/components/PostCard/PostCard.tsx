"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Link from "next/link";
import { Repeat2 } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostMedia from "./PostMedia";
import PostComments from "./PostComments";
import PostDropdown from "./PostDropdown";
import CommentInput from "./CommentInput";

import {
	toggleLike,
	createComment,
	deletePost,
	repostPost,
	savePost,
} from "@/actions/post.action";
import { Post } from "@/lib/types";

interface PostCardProps {
	post: Post;
	dbUserId: string | null;
	detailed?: boolean;
	isRepost?: boolean;
}

const PostCard = ({
	post,
	dbUserId,
	detailed = false,
	isRepost,
}: PostCardProps) => {
	const { user } = useUser();
	const isAuthor = dbUserId === post.author.id;

	const [isLiking, setIsLiking] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const [isReposting, setIsReposting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showReplyInput, setShowReplyInput] = useState(false);

	const [hasLiked, setHasLiked] = useState(
		post.likes.some((like) => like.userId === dbUserId),
	);
	const [hasReposted, setHasReposted] = useState(
		post?.reposts.some((repost) => repost.userId === dbUserId),
	);
	const [likesCount, setLikesCount] = useState(post._count.likes);
	const [repostsCount, setRepostsCount] = useState(post._count.reposts);
	const [commentsCount, setCommentsCount] = useState(post.comments.length);

	const handleLike = async () => {
		if (isLiking || !user) return;

		try {
			setIsLiking(true);
			const prevLiked = hasLiked;
			setHasLiked(!prevLiked);
			setLikesCount((prev) => prev + (prevLiked ? -1 : 1));

			const result = await toggleLike(post.id);
			if (!result?.success) {
				setHasLiked(prevLiked);
				setLikesCount((prev) => prev - (prevLiked ? -1 : 1));
				toast.error("Failed to like post");
			}
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLiking(false);
		}
	};

	const handleComment = async (content: string) => {
		if (!content.trim() || isCommenting || !user) return;

		try {
			setIsCommenting(true);
			const result = await createComment(post.id, content.trim());

			if (result?.success) {
				setCommentsCount((prev) => prev + 1);
				setShowReplyInput(false);
				toast.success("Reply posted!");
				return true;
			} else {
				toast.error("Failed to post reply");
				return false;
			}
		} catch (error) {
			toast.error("Something went wrong");
			return false;
		} finally {
			setIsCommenting(false);
		}
	};

	const handleRepost = async () => {
		if (isReposting || !user) return;

		try {
			setIsReposting(true);
			const prevReposted = hasReposted;
			setHasReposted(!prevReposted);
			setRepostsCount((prev) => prev + (prevReposted ? -1 : 1));

			const result = await repostPost(post.id);

			if (result?.success) {
				toast.success(
					result.action === "reposted" ? "Reposted!" : "Removed repost",
				);
				if (!result.success) {
					setHasReposted(prevReposted);
					setRepostsCount((prev) => prev - (prevReposted ? -1 : 1));
				}
			} else {
				setHasReposted(prevReposted);
				setRepostsCount((prev) => prev - (prevReposted ? -1 : 1));
				toast.error("Failed to repost");
			}
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsReposting(false);
		}
	};

	const handleDelete = async () => {
		if (isDeleting) return;

		try {
			setIsDeleting(true);
			const result = await deletePost(post.id);

			if (result.success) {
				toast.success("Post deleted successfully");

				if (
					typeof window !== "undefined" &&
					window.location.pathname.includes("/status/")
				) {
					window.location.href = "/";
				}
			} else {
				toast.error(result.error || "Failed to delete post");
			}
		} catch (error) {
			console.error("Delete error:", error);
      toast.error("Something went wrong");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleSave = async () => {
		if (!user) return;
		try {
			const result = await savePost(post.id);
			if (result?.success) {
				toast.success(
					result.action === "saved" ? "Saved!" : "Removed from saves",
				);
			}
		} catch (error) {
			toast.error("Failed to save post");
		}
	};

	return (
		<div className="border-x border-b border-border hover:bg-accent/5 transition-colors">
			{isRepost && (
				<div className="px-4 pt-2 text-xs text-muted-foreground flex items-center gap-1">
					<Repeat2 className="h-3 w-3" />
					<span>Reposted</span>
				</div>
			)}
			<div className="px-4 py-3">
				<div className="flex items-start justify-between">
					<div className="flex items-start space-x-3 min-w-0 flex-1">
						{/* Avatar */}
						<Link
							href={`/profile/${post.author.username}`}
							className="shrink-0"
						>
							<Avatar className="h-10 w-10">
								<AvatarImage src={post.author.image || "/avatar.png"} />
								<AvatarFallback>{post.author.name?.[0] || "U"}</AvatarFallback>
							</Avatar>
						</Link>

						<div className="flex-1 min-w-0">
							{/* Header */}
							<PostHeader
								name={post.author.name}
								username={post.author.username}
								createdAt={post.createdAt}
								isAuthor={isAuthor}
								onDelete={handleDelete}
								isDeleting={isDeleting}
							/>

							{/* Content */}
							<PostContent content={post.content} postId={post.id} />

							{/* Media */}
							{post.image && <PostMedia image={post.image} />}

							{/* Actions */}
							<PostActions
								user={user}
								hasLiked={hasLiked}
								hasReposted={hasReposted}
								likesCount={likesCount}
								repostsCount={repostsCount}
								commentsCount={commentsCount}
								onLike={handleLike}
								onRepost={handleRepost}
								onCommentToggle={() => setShowReplyInput(!showReplyInput)}
								onShare={() => {
									navigator.clipboard.writeText(
										`${window.location.origin}/status/${post.id}`,
									);
									toast.success("Link copied!");
								}}
								isLiking={isLiking}
								isReposting={isReposting}
								showReplyInput={showReplyInput}
							/>

							{/* Reply Input */}
							{showReplyInput && user && (
								<CommentInput
									onSubmit={handleComment}
									isCommenting={isCommenting}
									placeholder="Write a reply..."
									autoFocus
								/>
							)}
						</div>
					</div>

					{/* Dropdown Menu */}
					<PostDropdown
						isAuthor={isAuthor}
						onDelete={handleDelete}
						onSave={handleSave}
						postId={post.id}
						isDeleting={isDeleting}
					/>
				</div>

				{/* Comments Section */}
				{detailed && <PostComments comments={post.comments} />}
			</div>
		</div>
	);
};

export default PostCard;
