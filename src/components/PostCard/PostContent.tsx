import Link from "next/link";

interface PostContentProps {
	content: string | null;
	postId: string;
}

const PostContent = ({ content, postId }: PostContentProps) => {
	return (
		<Link href={`/status/${postId}`}>
			<p className="mt-1 text-base wrap-break-words whitespace-pre-wrap">
				{content}
			</p>
		</Link>
	);
};

export default PostContent;
