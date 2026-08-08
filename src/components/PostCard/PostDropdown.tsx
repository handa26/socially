import Link from "next/link";
import { MoreHorizontal, Trash2, Bookmark, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostDropdownProps {
	isAuthor: boolean;
	onDelete: () => void;
	onSave: () => void;
	postId: string;
	isDeleting: boolean;
}

const PostDropdown = ({
	isAuthor,
	onDelete,
	onSave,
	postId,
	isDeleting,
}: PostDropdownProps) => {
	return (
		<div className="shrink-0 ml-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{isAuthor && (
						<DropdownMenuItem
							onClick={onDelete}
							className="text-red-500 focus:text-red-500"
							disabled={isDeleting}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							{isDeleting ? "Deleting..." : "Delete"}
						</DropdownMenuItem>
					)}
					<DropdownMenuItem onClick={onSave}>
						<Bookmark className="h-4 w-4 mr-2" />
						Save
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href={`/status/${postId}`} className="flex items-center">
							<ExternalLink className="h-4 w-4 mr-2" />
							View details
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default PostDropdown;
