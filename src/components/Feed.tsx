import PostCard from "./PostCard/PostCard";

import { getDbUserId } from "@/actions/user.action";
import { getPosts } from "@/actions/post.action";

const Feed = async () => {
	const posts = await getPosts();
	const dbUserId = await getDbUserId();

	return (
		<div className="">
			{posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					dbUserId={dbUserId}
					isRepost={post.isRepost}
				/>
			))}
		</div>
	);
};

export default Feed;
