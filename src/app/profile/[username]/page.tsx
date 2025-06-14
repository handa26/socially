import { notFound } from "next/navigation";

import ProfilePageClient from "./ProfilePageClient";

import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.action";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);

  return {
    title: `${user?.name ?? user?.username} `,
    description: user?.bio || `Checkout ${user?.username}'s profile`,
  };
}

const Page = async ({ params }: { params: { username: string } }) => {
  const user = await getProfileByUsername(params.username);
  const dbUserId = await getDbUserId();
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
      dbUserId={dbUserId}
    />
  );
};

export default Page;
