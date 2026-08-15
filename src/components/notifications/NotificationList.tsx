"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";

import {
	getNotifications,
	markAllNotificationsAsRead,
} from "@/actions/notification.action";
import type { Notification } from "@/lib/types";

interface NotificationListProps {
	initialNotifications?: Notification[];
}

const NotificationList = ({
	initialNotifications = [],
}: NotificationListProps) => {
	const router = useRouter();
	const [notifications, setNotifications] =
		useState<Notification[]>(initialNotifications);
	const [isLoading, setIsLoading] = useState(!initialNotifications.length);
	const [isMarkingAll, setIsMarkingAll] = useState(false);

	const unreadCount = notifications.filter((n) => !n.read).length;

	useEffect(() => {
		if (!initialNotifications.length) {
			fetchNotifications();
		}
	}, []);

	const fetchNotifications = async () => {
		try {
			setIsLoading(true);
			const data = await getNotifications();
			setNotifications(data);
		} catch (error) {
			toast.error("Failed to fetch notifications");
		} finally {
			setIsLoading(false);
		}
	};

	const handleMarkAllAsRead = async () => {
		if (unreadCount === 0 || isMarkingAll) return;

		try {
			setIsMarkingAll(true);
			const result = await markAllNotificationsAsRead();
			if (result.success) {
				setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
				toast.success("All notifications marked as read");
			} else {
				toast.error("Failed to mark all as read");
			}
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsMarkingAll(false);
		}
	};

	const handleNotificationRead = () => {
		router.refresh();
	};

	if (isLoading) return <NotificationsSkeleton />;

	return (
		<div className="">
			{/* Header */}
			<div className="sticky top-0 flex items-center justify-between bg-black/50 backdrop-blur-md z-50 p-4 border-b border-border">
				<div className="flex items-center gap-3">
					<Bell className="w-5 h-5" />
					<h2 className="font-semibold">Notifications</h2>
					{unreadCount > 0 && (
						<span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
							{unreadCount} new
						</span>
					)}
				</div>
				{unreadCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleMarkAllAsRead}
						disabled={isMarkingAll}
						className="gap-2 text-sm"
					>
						<CheckCheck className="w-4 h-4" />
						{isMarkingAll ? "Marking..." : "Mark all as read"}
					</Button>
				)}
			</div>

			{/* Notification List */}
				{notifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
						<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
							<Bell className="w-8 h-8 text-muted-foreground" />
						</div>
						<h3 className="font-semibold text-lg">No notifications yet</h3>
						<p className="text-sm text-muted-foreground mt-1 max-w-sm">
							When someone interacts with your posts or follows you, you'll see
							it here.
						</p>
					</div>
				) : (
					<div className="divide-y divide-border">
						{notifications.map((notification) => (
							<NotificationItem
								key={notification.id}
								notification={notification}
								onRead={handleNotificationRead}
							/>
						))}
					</div>
				)}
		</div>
	);
};

export default NotificationList;
