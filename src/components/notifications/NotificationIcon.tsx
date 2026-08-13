"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUnreadNotificationCount } from "@/actions/notification.action";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface NotificationIconProps {
	initialCount?: number;
}

const NotificationIcon = ({ initialCount = 0 }: NotificationIconProps) => {
	const pathname = usePathname();
	const [unreadCount, setUnreadCount] = useState(initialCount);
	const isActive = pathname === "/notifications";

	useEffect(() => {
		// Update count when user navigates away from notifications
		if (isActive && unreadCount > 0) {
			// The count will be updated via the page refresh
			setUnreadCount(0);
		}
	}, [isActive]);

	// Poll for new notifications every 30 seconds
	useEffect(() => {
		const pollNotifications = async () => {
			if (!isActive) {
				try {
					const count = await getUnreadNotificationCount();
					setUnreadCount(count);
				} catch (error) {
					console.error("Failed to fetch notification count:", error);
				}
			}
		};

		const interval = setInterval(pollNotifications, 30000);
		return () => clearInterval(interval);
	}, [isActive]);

	return (
		<Link
			href="/notifications"
			className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4 mb-4"
		>
			<div className="relative">	
				<Image
					src="/icons/notification.svg"
					alt="Notification icon"
					width={24}
					height={24}
				/>
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[9px] font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
						{unreadCount > 99 ? "99+" : unreadCount}
					</span>
				)}
			</div>
			<span className="hidden xxl:inline">Notification</span>
		</Link>
	);
};

export default NotificationIcon;
