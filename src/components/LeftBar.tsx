"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
	Ellipsis,
	LogOut,
	Home,
	Compass,
	Mail,
	Bookmark,
	Briefcase,
	Users,
	Crown,
	User,
	MoreHorizontal,
	Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationIcon from "./notifications/NotificationIcon";
import MenuItem from "./MenuItem";
import IconWrapper from "./IconWrapper";

import { getUnreadNotificationCount } from "@/actions/notification.action";
import { cn } from "@/lib/utils";

interface MenuItemType {
	id: string;
	name: string;
	link: string;
	icon: React.ReactNode;
	isNotification?: boolean;
	isProfile?: boolean;
	exactMatch?: boolean;
}

interface LeftBarProps {
	user: {
		id: string;
		username: string;
		name: string | null;
		image: string | null;
	};
	initialUnreadCount?: number;
}

const LeftBar = ({ user, initialUnreadCount = 0 }: LeftBarProps) => {
	const pathname = usePathname();
	const { user: clerkUser } = useUser();
	const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

	const baseMenuItems: MenuItemType[] = [
		{
			id: "home",
			name: "Home",
			link: "/",
			icon: <Home className="w-6 h-6" />,
			exactMatch: true,
		},
		{
			id: "explore",
			name: "Explore",
			link: "/explore",
			icon: <Compass className="w-6 h-6" />,
		},
		{
			id: "notifications",
			name: "Notifications",
			link: "/notifications",
			icon: <Bell className="w-6 h-6" />,
			isNotification: true,
		},
		{
			id: "messages",
			name: "Messages",
			link: "/messages",
			icon: <Mail className="w-6 h-6" />,
		},
		{
			id: "bookmarks",
			name: "Bookmarks",
			link: "/bookmarks",
			icon: <Bookmark className="w-6 h-6" />,
		},
		{
			id: "jobs",
			name: "Jobs",
			link: "/jobs",
			icon: <Briefcase className="w-6 h-6" />,
		},
		{
			id: "communities",
			name: "Communities",
			link: "/communities",
			icon: <Users className="w-6 h-6" />,
		},
		{
			id: "premium",
			name: "Premium",
			link: "/premium",
			icon: <Crown className="w-6 h-6" />,
		},
		{
			id: "profile",
			name: "Profile",
			link: `/profile/${user.username}`,
			icon: <User className="w-6 h-6" />,
			isProfile: true,
		},
		{
			id: "more",
			name: "More",
			link: "/more",
			icon: <MoreHorizontal className="w-6 h-6" />,
		},
	];

	// Update menu items with dynamic profile link
	const menuItems = baseMenuItems.map((item) => {
		if (item.isProfile && user) {
			return {
				...item,
				link: `/profile/${user.username}`,
			};
		}
		return item;
	});

	// Check if a path is active
	const isPathActive = (path: string, exactMatch = false) => {
		if (exactMatch) {
			return pathname === path;
		}
		return pathname?.startsWith(path) || false;
	};

	// Update unread count periodically
	useEffect(() => {
		const updateUnreadCount = async () => {
			try {
				const count = await getUnreadNotificationCount();
				setUnreadCount(count);
			} catch (error) {
				console.error("Failed to fetch unread count:", error);
			}
		};

		// Reset unread count when on notifications page
		if (pathname === "/notifications" && unreadCount > 0) {
			setUnreadCount(0);
		}

		const interval = setInterval(updateUnreadCount, 30000);
		return () => clearInterval(interval);
	}, [pathname, unreadCount]);

	if (!clerkUser) return null;

	return (
		<div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8 px-2 xxl:px-4">
			{/* Top Section */}
			<div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
				{/* Logo */}
				<Link
					href="/"
					className="rounded-full hover:bg-accent/50 transition-colors"
				>
						<Image
							src="/socially-logo.png"
							alt="logo"
							width={48}
							height={48}
							className="object-contain"
						/>
				</Link>

				{/* Menu Items */}
				<div className="flex flex-col gap-4 w-full">
					{baseMenuItems.map((item) => {
						// Special handling for notifications
						if (item.isNotification) {
							return (
								<NotificationIcon
									key={item.id}
									initialCount={unreadCount}
									label={item.name}
									showLabel={true}
								/>
							);
						}

						return (
							<MenuItem
								key={item.id}
								href={item.link}
								icon={item.icon}
								label={item.name}
								exactMatch={item.exactMatch}
								showLabel={true}
							/>
						);
					})}
				</div>

				{/* Post Button */}
				<Link
					href="/compose/post"
					className="bg-blue-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center xxl:hidden hover:bg-blue-600 transition-colors"
				>
					<IconWrapper size="md" className="text-white">
						<svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
							<path d="M18 10.5h-4.5V6h-3v4.5H6v3h4.5V18h3v-4.5H18v-3Z" />
						</svg>
					</IconWrapper>
				</Link>
				<Link
					href="/compose/post"
					className="hidden xxl:block bg-blue-500 text-white rounded-full w-full font-bold py-2 px-20 hover:bg-blue-600 transition-colors text-center"
				>
					Post
				</Link>
			</div>

			{/* Bottom Section - User Profile */}
			<div className="flex items-center justify-between w-full">
				<Link
					href={`/profile/${user.username}`}
					className={cn(
						"flex items-center gap-2 p-2 rounded-full hover:bg-accent/50 transition-colors flex-1",
						pathname === `/profile/${user.username}` && "bg-accent/50",
					)}
				>
					<div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0">
						<Image
							src={user.image || "/avatar.png"}
							alt={user.name || user.username}
							width={40}
							height={40}
							className="object-cover"
						/>
					</div>
					<div className="hidden xxl:flex flex-col min-w-0">
						<span className="font-bold text-sm truncate">
							{user.name || user.username}
						</span>
						<span className="text-sm text-muted-foreground truncate">
							@{user.username}
						</span>
					</div>
				</Link>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="hidden xxl:flex rounded-full hover:bg-accent/50"
						>
							<Ellipsis className="w-5 h-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem className="cursor-pointer">
							<LogOut className="w-4 h-4 mr-2" />
							<SignOutButton redirectUrl="/sign-in">
								<span>Log out</span>
							</SignOutButton>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default LeftBar;
