import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { LogOutIcon, EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationIcon from "./notifications/NotificationIcon";

import { getUserByClerkId } from "@/actions/user.action";
import { redirect } from "next/navigation";
import { getUnreadNotificationCount } from "@/actions/notification.action";

const baseMenuList = [
	{
		id: 1,
		name: "Home",
		link: "/",
		icon: "home.svg",
	},
	{
		id: 2,
		name: "Explore",
		link: "/",
		icon: "explore.svg",
	},
	// {
	// 	id: 3,
	// 	name: "Notification",
	// 	link: "/notifications",
	// 	icon: "notification.svg",
	// },
	{
		id: 4,
		name: "Messages",
		link: "/",
		icon: "message.svg",
	},
	{
		id: 5,
		name: "Bookmarks",
		link: "/",
		icon: "bookmark.svg",
	},
	{
		id: 6,
		name: "Jobs",
		link: "/",
		icon: "job.svg",
	},
	{
		id: 7,
		name: "Communities",
		link: "/",
		icon: "community.svg",
	},
	{
		id: 8,
		name: "Premium",
		link: "/",
		icon: "logo.svg",
	},
	{
		id: 9,
		name: "Profile",
		link: "/",
		icon: "profile.svg",
	},
	{
		id: 10,
		name: "More",
		link: "/",
		icon: "more.svg",
	},
];

const LeftBar = async () => {
	const authUser = await currentUser();
	if (!authUser) return redirect("/sign-in");

	const user = await getUserByClerkId(authUser.id);
	if (!user) return null;

	const menuList = baseMenuList.map((item) => {
		if (item.name === "Profile") {
			return {
				...item,
				link: `/profile/${user.username}`,
			};
		}
		return item;
	});

	const unreadCount = await getUnreadNotificationCount();

	return (
		<div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
			{/* LOGO, MENU, BUTTON */}
			<div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
				{/* LOGO */}
				<Link href="/" className="p-2 rounded-full hover:bg-[#181818]">
					<Image src="/icons/logo.svg" alt="logo" width={24} height={24} />
				</Link>

				{/* MENU LIST */}
				<div className="flex flex-col gap-4">
					{menuList.map((item, i) => (
						<div key={item.id || i}>
							{i === 2 && user && <NotificationIcon initialCount={unreadCount} />}
							<Link
								href={item.link}
								className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
							>
								<Image
									src={`/icons/${item.icon}`}
									alt={item.name}
									width={24}
									height={24}
								/>
								<span className="hidden xxl:inline">{item.name}</span>
							</Link>
						</div>
					))}
				</div>

				{/* POST BUTTON */}
				<Link
					href=""
					className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
				>
					<Image src="icons/post.svg" alt="new post" width={24} height={24} />
				</Link>
				<Link
					href="/compose/post"
					className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
				>
					Post
				</Link>
			</div>

			{/* USER */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 relative rounded-full overflow-hidden">
						<Image
							src={user.image || "/avatar.png"}
							alt="user avatar"
							width={100}
							height={100}
						/>
					</div>
					<div className="hidden xxl:flex flex-col">
						<span className="font-bold">{user.name}</span>
						<span className="text-sm text-textGray">@{user.username}</span>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
						className="hidden xxl:block cursor-pointer font-bold p-2 rounded-full hover:bg-[#181818]"
						render={<Button asChild variant="outline" className="" />}
					>
						<EllipsisIcon />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem variant="destructive">
							<LogOutIcon />
							<SignOutButton redirectUrl="/sign-in">Log out</SignOutButton>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default LeftBar;
