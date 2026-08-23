"use client";

import Link from "next/link";
import { useState } from "react";
import {
	MoreHorizontal,
	Trash2,
	Bookmark,
	ExternalLink,
	BookmarkCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";

interface PostDropdownProps {
	isAuthor: boolean;
	onDelete: () => void;
	onSave: () => void;
	postId: string;
	isDeleting: boolean;
	isSaved?: boolean;
}

const PostDropdown = ({
	isAuthor,
	onDelete,
	onSave,
	postId,
	isDeleting,
	isSaved = false,
}: PostDropdownProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleDeleteClick = () => {
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		await onDelete();
		setShowDeleteDialog(false);
	};

	console.log(isSaved);

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
							onClick={handleDeleteClick}
							className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30"
							variant="destructive"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</DropdownMenuItem>
					)}
					<DropdownMenuItem onClick={onSave}>
						{isSaved ? (
							<BookmarkCheck className="h-4 w-4 mr-2 text-blue-500" />
						) : (
							<Bookmark className="h-4 w-4 mr-2" />
						)}
						{isSaved ? "Saved" : "Save"}
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href={`/status/${postId}`} className="flex items-center">
							<ExternalLink className="h-4 w-4 mr-2" />
							View details
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeleteConfirmationDialog
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onConfirm={handleConfirmDelete}
				isDeleting={isDeleting}
			/>
		</div>
	);
};

export default PostDropdown;
