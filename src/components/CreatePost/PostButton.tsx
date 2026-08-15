import { Loader2, Send } from "lucide-react";

import { Button } from "../ui/button";

interface PostButtonProps {
	onClick: () => void;
	isDisabled: boolean;
	isPosting: boolean;
	isUploading: boolean;
}

const PostButton = ({
	onClick,
	isDisabled,
	isPosting,
	isUploading,
}: PostButtonProps) => {
	const isLoading = isPosting || isUploading;
	const loadingText = isUploading ? "Uploading..." : "Posting...";

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className="bg-iconBlue text-white font-bold rounded-full px-6 py-2 
               hover:bg-opacity-90 transition disabled:opacity-50 
               disabled:cursor-not-allowed flex items-center gap-2"
		>
			{isLoading ? (
				<>
					<Loader2 className="w-4 h-4 animate-spin" />
					{loadingText}
				</>
			) : (
				<>
					<Send className="w-4 h-4" />
					Post
				</>
			)}
		</button>
	);
};

export default PostButton;
