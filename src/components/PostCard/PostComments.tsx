import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	author: {
		id: string;
		name: string | null;
		username: string;
		image: string | null;
	};
}

interface PostCommentsProps {
	comments: Comment[];
}

const PostComments = ({ comments }: PostCommentsProps) => {
	if (comments.length === 0) return null;

	return (
		<div className="mt-4 space-y-4">
			{comments.map((comment) => (
				<div key={comment.id} className="flex items-start space-x-3 pl-12">
					<Link href={`/profile/${comment.author.username}`}>
						<Avatar className="h-8 w-8 shrink-0">
							<AvatarImage src={comment.author.image || "/avatar.png"} />
							<AvatarFallback>{comment.author.name?.[0] || "U"}</AvatarFallback>
						</Avatar>
					</Link>
					<div className="flex-1 min-w-0">
						<div className="flex items-center space-x-1 text-sm">
							<Link
								href={`/profile/${comment.author.username}`}
								className="font-bold hover:underline"
							>
								{comment.author.name}
							</Link>
							<span className="text-muted-foreground">
								@{comment.author.username}
							</span>
							<span className="text-muted-foreground">·</span>
							<span className="text-muted-foreground text-xs">
								{formatDistanceToNow(new Date(comment.createdAt), {
									addSuffix: true,
								})}
							</span>
						</div>
						<p className="text-sm wrap-break-words">{comment.content}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default PostComments;
