"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import EditProfileDialog from "@/components/profile/EditProfileDialog";

import { toggleFollow } from "@/actions/user.action";

interface ProfilePageClientProps {
	user: any;
	posts: any[];
	reposts: any[];
	likedPosts: any[];
	isFollowing: boolean;
	dbUserId: string | null;
}

const ProfilePageClient = ({
	user,
	posts,
	reposts,
	likedPosts,
	isFollowing: initialIsFollowing,
	dbUserId,
}: ProfilePageClientProps) => {
	const { user: currentUser } = useUser();

	const [showEditDialog, setShowEditDialog] = useState(false);
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

	const isOwnProfile = currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

	const handleFollow = async () => {
		if (!currentUser) return;

		try {
			setIsUpdatingFollow(true);
			await toggleFollow(user.id);
			setIsFollowing(!isFollowing);
			toast.success(isFollowing ? "Unfollowed" : "Followed");
		} catch (error) {
			toast.error("Failed to update follow status");
		} finally {
			setIsUpdatingFollow(false);
		}
	};

	return (
		<div className="max-w-150 mx-auto">
			<ProfileHeader
				user={user}
				isOwnProfile={isOwnProfile}
				isFollowing={isFollowing}
				onFollow={handleFollow}
				onEdit={() => setShowEditDialog(true)}
				isUpdatingFollow={isUpdatingFollow}
			/>

			<ProfileTabs
				posts={posts}
				reposts={reposts}
				likedPosts={likedPosts}
				dbUserId={dbUserId}
			/>

			<EditProfileDialog
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
				user={user}
			/>
		</div>
	);
};

export default ProfilePageClient;
