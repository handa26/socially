import PostCardDetail from "@/components/PostCardDetail";
import MobileProfileNav from "@/components/profile/MobileProfileNav";

import { getPostById } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const postId = (await params).id;
	const post = await getPostById(postId);
	const dbUserId = await getDbUserId();

	if (!post) {
		return (
			<div className="flex justify-center items-center min-h-100">
				<p className="text-muted-foreground">Post not found</p>
			</div>
		);
	}

	return (
		<div className="max-w-150 mx-auto">
			<MobileProfileNav title="Post" />
			<PostCardDetail post={post} dbUserId={dbUserId} />
		</div>
	);
};

export default Page;
