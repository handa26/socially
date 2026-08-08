"use client";

import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Link from "next/link";
import {
	Heart,
	MessageCircle,
	Repeat2,
	Share,
	MoreHorizontal,
	Trash2,
	ExternalLink,
	Bookmark,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import DeleteAlertDialog from "./DeleteAlertDialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
	getPosts,
	toggleLike,
	createComment,
	deletePost,
	repostPost,
	savePost,
} from "@/actions/post.action";
import { formatPostDate, cn } from "@/lib/utils";
import { Post } from "@/lib/types";

interface PostCardProps {
	post: Post;
	dbUserId: string | null;
	detailed?: boolean;
	isRepost?: boolean;
}

const PostCard = ({ post, dbUserId, detailed = false, isRepost }: PostCardProps) => {
	const { user } = useUser();
	const isAuthor = dbUserId === post.author.id;

	const [isLiking, setIsLiking] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const [isReposting, setIsReposting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [newComment, setNewComment] = useState("");
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

	const handleComment = async () => {
		if (!newComment.trim() || isCommenting || !user) return;

		try {
			setIsCommenting(true);
			const result = await createComment(post.id, newComment.trim());

			if (result?.success) {
				setCommentsCount((prev) => prev + 1);
				setNewComment("");
				setShowReplyInput(false);
				toast.success("Reply posted!");
			} else {
				toast.error("Failed to post reply");
			}
		} catch (error) {
			toast.error("Something went wrong");
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
        toast.success(result.action === "reposted" ? "Reposted!" : "Removed repost");
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
				toast.success("Post deleted");
				// Optionally refresh or redirect
			} else {
				toast.error("Failed to delete post");
			}
		} catch (error) {
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
				{/* Post header */}
				<div className="flex items-start justify-between">
					<div className="flex items-start space-x-3 min-w-0 flex-1">
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
							<div className="flex items-center space-x-1 text-sm">
								<Link
									href={`/profile/${post.author.username}`}
									className="font-bold hover:underline truncate"
								>
									{post.author.name}
								</Link>
								<span className="text-muted-foreground truncate">
									@{post.author.username}
								</span>
								<span className="text-muted-foreground">·</span>
								<span className="text-muted-foreground whitespace-nowrap">
									{formatDistanceToNow(new Date(post.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>

							{/* Post content */}
							<Link href={`/status/${post.id}`}>
								<p className="mt-1 text-base wrap-break-words whitespace-pre-wrap">
									{post.content}
								</p>
							</Link>

							{/* Post image */}
							{post.image && (
								<div className="mt-3 rounded-2xl overflow-hidden border border-border">
									<div className="relative">
										<img
											src={post.image}
											alt="Post content"
											className="w-full h-auto object-cover max-h-128"
										/>
									</div>
								</div>
							)}

							{/* Action buttons */}
							<div className="flex items-center justify-between mt-3 max-w-md">
								{/* Comment button */}
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-1"
									onClick={() => setShowReplyInput(!showReplyInput)}
								>
									<MessageCircle className="h-5 w-5" />
									<span className="text-sm">{commentsCount}</span>
								</Button>

								{/* Repost button */}
								{user ? (
									<Button
										variant="ghost"
										size="sm"
										className={cn(
                      "gap-1 hover:bg-green-50 dark:hover:bg-green-950/30",
                      hasReposted 
                        ? "text-green-500 hover:text-green-600" 
                        : "text-muted-foreground hover:text-green-500"
                    )}
										onClick={handleRepost}
										disabled={isReposting}
									>
										<Repeat2 className={cn("h-5 w-5")} />
                    <span className="text-sm">{repostsCount}</span>
									</Button>
								) : (
									<SignInButton mode="modal">
										<Button
											variant="ghost"
											size="sm"
											className="text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 gap-1"
										>
											<Repeat2 className="h-5 w-5" />
                      <span className="text-sm">{repostsCount}</span>
										</Button>
									</SignInButton>
								)}

								{/* Like button */}
								{user ? (
									<Button
										variant="ghost"
										size="sm"
										className={cn(
											"gap-1 hover:bg-red-50 dark:hover:bg-red-950/30",
											hasLiked
												? "text-red-500 hover:text-red-600"
												: "text-muted-foreground hover:text-red-500",
										)}
										onClick={handleLike}
										disabled={isLiking}
									>
										<Heart
											className={cn("h-5 w-5", hasLiked && "fill-current")}
										/>
										<span className="text-sm">{likesCount}</span>
									</Button>
								) : (
									<SignInButton mode="modal">
										<Button
											variant="ghost"
											size="sm"
											className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1"
										>
											<Heart className="h-5 w-5" />
											<span className="text-sm">{likesCount}</span>
										</Button>
									</SignInButton>
								)}

								{/* Share button */}
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
									onClick={() => {
										navigator.clipboard.writeText(
											`${window.location.origin}/status/${post.id}`,
										);
										toast.success("Link copied!");
									}}
								>
									<Share className="h-5 w-5" />
								</Button>
							</div>

							{/* Reply input */}
							{showReplyInput && user && (
								<div className="mt-3 flex items-start space-x-3">
									<Avatar className="h-8 w-8 shrink-0">
										<AvatarImage src={user.imageUrl || "/avatar.png"} />
										<AvatarFallback>
											{user.firstName?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<Textarea
											placeholder="Write a reply..."
											value={newComment}
											onChange={(e) => setNewComment(e.target.value)}
											className="min-h-15 resize-none border-0 p-0 focus-visible:ring-0"
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													handleComment();
												}
											}}
										/>
										<div className="flex justify-end mt-2">
											<Button
												size="sm"
												onClick={handleComment}
												disabled={!newComment.trim() || isCommenting}
												className="rounded-full px-4"
											>
												{isCommenting ? "Posting..." : "Reply"}
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* More options dropdown */}
					<div className="shrink-0 ml-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{isAuthor && (
									<DropdownMenuItem
										onClick={handleDelete}
										className="text-red-500 focus:text-red-500"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</DropdownMenuItem>
								)}
								<DropdownMenuItem onClick={handleSave}>
									<Bookmark className="h-4 w-4 mr-2" />
									Save
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link
										href={`/status/${post.id}`}
										className="flex items-center"
									>
										<ExternalLink className="h-4 w-4 mr-2" />
										View details
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Comments section (only for detailed view) */}
				{detailed && post.comments.length > 0 && (
					<div className="mt-4 space-y-4">
						{post.comments.map((comment) => (
							<div
								key={comment.id}
								className="flex items-start space-x-3 pl-12"
							>
								<Link href={`/profile/${comment.author.username}`}>
									<Avatar className="h-8 w-8 shrink-0">
										<AvatarImage src={comment.author.image || "/avatar.png"} />
										<AvatarFallback>
											{comment.author.name?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
								</Link>
								<div className="flex-1 min-w-0">
									<div className="flex items-center space-x-1 text-sm">
										<Link
											href={`/profile/${comment.author.username}`}
											className="font-bold hover:underline"
										>
											{comment.author.name}
										</Link>
										<span className="text-muted-foreground">
											@{comment.author.username}
										</span>
										<span className="text-muted-foreground">·</span>
										<span className="text-muted-foreground text-xs">
											{formatDistanceToNow(new Date(comment.createdAt), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-sm wrap-break-words">{comment.content}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PostCard;
