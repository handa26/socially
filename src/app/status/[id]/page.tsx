import { notFound } from "next/navigation";

import PostCardDetail from "@/components/PostCardDetail";

import { getPostById } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const postId = (await params).id;
  const post = await getPostById(postId);
  const dbUserId = await getDbUserId();

  if (!post) notFound();

  return <PostCardDetail post={post} dbUserId={dbUserId} />;
};

export default Page;
