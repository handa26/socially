import { SignInButton } from "@clerk/nextjs";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import type { UserResource } from "@clerk/nextjs/types";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface PostActionsProps {
	user: UserResource | undefined | null;
	hasLiked: boolean;
	hasReposted: boolean;
	likesCount: number;
	repostsCount: number;
	commentsCount: number;
	onLike: () => void;
	onRepost: () => void;
	onCommentToggle: () => void;
	onShare: () => void;
	isLiking: boolean;
	isReposting: boolean;
	showReplyInput: boolean;
}

const PostActions = ({
	user,
	hasLiked,
	hasReposted,
	likesCount,
	repostsCount,
	commentsCount,
	onLike,
	onRepost,
	onCommentToggle,
	onShare,
	isLiking,
	isReposting,
	showReplyInput,
}: PostActionsProps) => {
	const actionButtons = [
		{
			icon: MessageCircle,
			label: "Comment",
			count: commentsCount,
			onClick: onCommentToggle,
			color: "hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30",
			className: showReplyInput ? "text-blue-500" : "",
		},
		{
			icon: Repeat2,
			label: "Repost",
			count: repostsCount,
			onClick: onRepost,
			color: hasReposted
				? "text-green-500 hover:text-green-600"
				: "text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30",
			disabled: isReposting,
			className: hasReposted ? "text-green-500" : "",
		},
		{
			icon: Heart,
			label: "Like",
			count: likesCount,
			onClick: onLike,
			color: hasLiked
				? "text-red-500 hover:text-red-600"
				: "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
			disabled: isLiking,
			className: hasLiked ? "text-red-500" : "",
			iconClassName: hasLiked ? "fill-current" : "",
		},
		{
			icon: Share,
			label: "Share",
			onClick: onShare,
			color:
				"text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30",
		},
	];

	const renderActionButton = (action: any, index: number) => {
		const button = (
			<Button
				key={index}
				variant="ghost"
				size="sm"
				className={cn("gap-1", action.color, action.className)}
				onClick={action.onClick}
				disabled={action.disabled}
			>
				<action.icon className={cn("h-5 w-5", action.iconClassName)} />
				{action.count !== undefined && (
					<span className="text-sm">{action.count}</span>
				)}
			</Button>
		);

		if (!user && (action.label === "Like" || action.label === "Repost")) {
			return (
				<SignInButton mode="modal" key={index}>
					{button}
				</SignInButton>
			);
		}

		return button;
	};

	return (
		<div className="flex items-center justify-between mt-3 max-w-md">
			{actionButtons.map((action, index) => renderActionButton(action, index))}
		</div>
	);
};

export default PostActions;
