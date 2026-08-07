import PostCard from "./PostCard";

import { Post } from "@/lib/types";

interface PostCardDetailProps {
	post: Post;
	dbUserId: string | null;
}

const PostCardDetail = ({ post, dbUserId }: PostCardDetailProps) => {
	return (
		<div className="max-w-150 mx-auto">
			<PostCard post={post} dbUserId={dbUserId} detailed />
		</div>
	);
};

export default PostCardDetail;
