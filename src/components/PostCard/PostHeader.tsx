import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
	name: string | null;
	username: string;
	createdAt: Date;
	isAuthor: boolean;
	onDelete: () => void;
	isDeleting: boolean;
}

const PostHeader = ({
	name,
	username,
	createdAt,
	isAuthor,
	onDelete,
	isDeleting,
}: PostHeaderProps) => {
	return (
		<div className="flex items-center space-x-1 text-sm">
			<Link
				href={`/profile/${username}`}
				className="font-bold hover:underline truncate"
			>
				{name}
			</Link>
			<span className="text-muted-foreground truncate">@{username}</span>
			<span className="text-muted-foreground">·</span>
			<span className="text-muted-foreground whitespace-nowrap">
				{formatDistanceToNow(new Date(createdAt), {
					addSuffix: true,
				})}
			</span>
		</div>
	);
};

export default PostHeader;
