"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import IconWrapper from "../IconWrapper";

import { getUnreadNotificationCount } from "@/actions/notification.action";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  initialCount?: number;
  label?: string;
  showLabel?: boolean;
}

const NotificationIcon = ({ 
  initialCount = 0, 
  label = "Notifications",
  showLabel = true 
}: NotificationIconProps) => {
	const pathname = usePathname();
	const [unreadCount, setUnreadCount] = useState(initialCount);

	const isActive = pathname === "/notifications";

	useEffect(() => {
		// Update count when user navigates away from notifications
		if (isActive && unreadCount > 0) {
			// The count will be updated via the page refresh
			setUnreadCount(0);
		}
	}, [isActive, unreadCount]);

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
      className={cn(
        "p-2 rounded-full flex items-center gap-4 transition-all duration-200 group relative w-full",
        isActive
          ? "bg-accent/50 text-foreground"
          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
      )}
    >
      <IconWrapper isActive={isActive} size="md">
        <div className="relative">
          <Bell className={cn(
            "w-6 h-6 transition-colors duration-200",
            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full animate-pulse ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </IconWrapper>

      {showLabel && (
        <span className={cn(
          "hidden xxl:inline font-medium transition-colors duration-200",
          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {label}
        </span>
      )}

      {/* {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full hidden xxl:block" />
      )} */}
    </Link>
	);
};

export default NotificationIcon;
