"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, UserPlus, Repeat2, Clock } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { markNotificationsAsRead } from "@/actions/notification.action";

import type { Notification } from "@/lib/types";

interface NotificationItemProps {
	notification: Notification;
	onRead?: () => void;
}

const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
	const router = useRouter();

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "LIKE":
				return <Heart className="w-4 h-4 text-red-500" />;
			case "COMMENT":
				return <MessageCircle className="w-4 h-4 text-blue-500" />;
			case "FOLLOW":
				return <UserPlus className="w-4 h-4 text-green-500" />;
			case "REPOST":
				return <Repeat2 className="w-4 h-4 text-green-500" />;
			default:
				return null;
		}
	};

	const getNotificationText = (type: string) => {
		switch (type) {
			case "LIKE":
				return "liked your post";
			case "COMMENT":
				return "commented on your post";
			case "FOLLOW":
				return "started following you";
			case "REPOST":
				return "reposted your post";
			default:
				return "";
		}
	};

	const getNotificationLink = (notification: Notification) => {
		if (notification.type === "FOLLOW") {
			return `/profile/${notification.creator.username}`;
		}
		if (notification.post) {
			return `/status/${notification.post.id}`;
		}
		return "#";
	};

	const handleClick = async () => {
		if (!notification.read) {
			await markNotificationsAsRead([notification.id]);
			onRead?.();
		}
		router.push(getNotificationLink(notification));
	};

	return (
		<div
			className={`flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
				!notification.read ? "bg-accent/30" : ""
			}`}
			onClick={handleClick}
		>
			{/* Unread Indicator */}
			{!notification.read && (
				<div className="w-2 h-2 mt-4 rounded-full bg-blue-500 shrink-0" />
			)}

			{/* Avatar */}
			<Link
				href={`/profile/${notification.creator.username}`}
				className="shrink-0 mt-1"
				onClick={(e) => e.stopPropagation()}
			>
				<Avatar className="w-10 h-10">
					<AvatarImage src={notification.creator.image ?? "/avatar.png"} />
					<AvatarFallback>
						{notification.creator.name?.[0] || notification.creator.username[0]}
					</AvatarFallback>
				</Avatar>
			</Link>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<div className="flex items-start gap-2">
					<div className="flex items-center gap-1.5 text-sm">
						<Link
							href={`/profile/${notification.creator.username}`}
							className="font-bold hover:underline truncate"
							onClick={(e) => e.stopPropagation()}
						>
							{notification.creator.name || notification.creator.username}
						</Link>
						<span className="text-muted-foreground whitespace-nowrap">
							@{notification.creator.username}
						</span>
					</div>
					<div className="shrink-0 mt-1">
						{getNotificationIcon(notification.type)}
					</div>
				</div>

				<p className="text-sm text-muted-foreground">
					{getNotificationText(notification.type)}
				</p>

				{/* Post Preview */}
				{notification.post && notification.type !== "FOLLOW" && (
					<div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
						<p className="text-sm line-clamp-2">
							{notification.post.content || "Post content"}
						</p>
						{notification.post.image && (
							<img
								src={notification.post.image}
								alt=""
								className="mt-2 rounded-md max-h-32 w-auto object-cover"
							/>
						)}
					</div>
				)}

				{/* Comment Preview */}
				{notification.comment && notification.type === "COMMENT" && (
					<div className="mt-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
						<p className="text-sm text-muted-foreground">
							<span className="font-medium text-foreground">Reply:</span>{" "}
							{notification.comment.content}
						</p>
					</div>
				)}

				{/* Timestamp */}
				<div className="flex items-center gap-1 mt-1.5">
					<Clock className="w-3 h-3 text-muted-foreground" />
					<span className="text-xs text-muted-foreground">
						{formatDistanceToNow(new Date(notification.createdAt), {
							addSuffix: true,
						})}
					</span>
				</div>
			</div>
		</div>
	);
};

export default NotificationItem;
