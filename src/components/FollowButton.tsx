"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

import { Button } from "./ui/button";

import { toggleFollow } from "@/actions/user.action";

const FollowButton = ({
	userId,
	initialIsFollowing = false,
}: {
	userId: string;
	initialIsFollowing?: boolean;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

	const router = useRouter();

	const handleFollow = async () => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			if (isFollowing) {
				await toggleFollow(userId);
				toast.success("Unfollowed!");
			} else {
				await toggleFollow(userId);
				toast.success("Following!");
			}
			setIsFollowing(!isFollowing);
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			size={"sm"}
			variant={"secondary"}
			onClick={handleFollow}
			disabled={isLoading}
			className={`px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer
                ${
									isFollowing
										? "bg-borderGray text-white hover:bg-[#1D1F23] border border-borderGray"
										: "bg-white text-black hover:bg-opacity-90"
								}
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
		>
			{isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
		</Button>
	);
};

export default FollowButton;
