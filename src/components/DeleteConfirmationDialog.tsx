import { Loader2Icon, Trash2 } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	isDeleting?: boolean;
}

const DeleteConfirmationDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Delete Post",
	description = "Are you sure you want to delete this post? This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	isDeleting = false,
}: DeleteConfirmationDialogProps) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2 text-red-500">
						<Trash2 className="h-5 w-5" />
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isDeleting}
						className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
					>
						{isDeleting ? (
							<>
								<Loader2Icon className="size-4 animate-spin" />
								Deleting...
							</>
						) : (
							confirmText
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteConfirmationDialog;
