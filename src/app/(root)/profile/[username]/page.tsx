import { notFound } from "next/navigation";

import ProfilePageClient from "./ProfilePageClient";

import {
	getProfileByUsername,
	getUserLikedPosts,
	getUserPosts,
	getUserReposts,
	isFollowing,
} from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.action";
import MobileProfileNav from "@/components/profile/MobileProfileNav";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const user = await getProfileByUsername(username);

	return {
		title: `${user?.name ?? user?.username} `,
		description: user?.bio || `Checkout ${user?.username}'s profile`,
	};
}

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;

	const user = await getProfileByUsername(username);
	const dbUserId = await getDbUserId();
	if (!user) notFound();

	const [posts, reposts, likedPosts, isCurrentUserFollowing] =
		await Promise.all([
			getUserPosts(user.id),
			getUserReposts(user.id),
			getUserLikedPosts(user.id),
			isFollowing(user.id),
		]);

	return (
    <>
      <MobileProfileNav username={username} />  
      <ProfilePageClient
        user={user}
        posts={posts}
        reposts={reposts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
        dbUserId={dbUserId}
      />
    </>
	);
};

export default Page;
