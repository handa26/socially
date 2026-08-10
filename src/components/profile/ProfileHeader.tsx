"use client";

import { format } from "date-fns";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
	user: any;
	isOwnProfile: boolean;
	isFollowing: boolean;
	onFollow: () => void;
	onEdit: () => void;
	isUpdatingFollow: boolean;
}

const ProfileHeader = ({
	user,
	isOwnProfile,
	isFollowing,
	onFollow,
	onEdit,
	isUpdatingFollow,
}: ProfileHeaderProps) => {
	const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

	return (
		<div className="mb-7.5">
			{/* Cover Image - optional */}
			<div className="h-48 bg-linear-to-r from-blue-500/20 to-purple-500/20" />

			<div className="px-4 -mt-12.5">
				<div className="flex justify-between items-end">
					<Avatar className="h-24 w-24 border-4 border-background">
						<AvatarImage src={user.image ?? "/avatar.png"} />
						<AvatarFallback>
							{user.name?.[0] || user.username[0]}
						</AvatarFallback>
					</Avatar>

					<div className="">
						{!isOwnProfile ? (
							<Button
								onClick={onFollow}
								disabled={isUpdatingFollow}
								variant={isFollowing ? "outline" : "default"}
								className="rounded-full font-bold px-6 cursor-pointer"
								size="lg"
							>
								{isFollowing ? "Unfollow" : "Follow"}
							</Button>
						) : (
							<Button
								onClick={onEdit}
								variant="outline"
								className="rounded-full font-bold px-6 cursor-pointer"
								size="lg"
							>
								Edit Profile
							</Button>
						)}
					</div>
				</div>

				<div className="mt-3">
					<h2 className="text-xl font-bold">{user.name || user.username}</h2>
					<p className="text-muted-foreground text-sm">@{user.username}</p>

					{user.bio && (
						<p className="mt-3 text-sm whitespace-pre-wrap">{user.bio}</p>
					)}

					<div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
						{user.location && (
							<div className="flex items-center gap-1">
								<MapPinIcon className="h-4 w-4" />
								<span>{user.location}</span>
							</div>
						)}
						{user.website && (
							<div className="flex items-center gap-1">
								<LinkIcon className="h-4 w-4" />
								<Link
									href={
										user.website.startsWith("http")
											? user.website
											: `https://${user.website}`
									}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline"
								>
									{user.website.replace(/^https?:\/\//, "")}
								</Link>
							</div>
						)}
						<div className="flex items-center gap-1">
							<CalendarIcon className="h-4 w-4" />
							<span>Joined {formattedDate}</span>
						</div>
					</div>

					<div className="mt-3 flex gap-4 text-sm">
						<Link
							href={`/profile/${user.username}/following`}
							className="hover:underline"
						>
							<span className="font-bold">{user._count.following}</span>
							<span className="text-muted-foreground ml-1">Following</span>
						</Link>
						<Link
							href={`/profile/${user.username}/followers`}
							className="hover:underline"
						>
							<span className="font-bold">{user._count.followers}</span>
							<span className="text-muted-foreground ml-1">Followers</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
