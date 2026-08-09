"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommentInputProps {
	onSubmit: (content: string) => Promise<boolean | void>;
	isCommenting: boolean;
	placeholder?: string;
	autoFocus?: boolean;
	onCancel?: () => void;
}

const CommentInput = ({
	onSubmit,
	isCommenting,
	placeholder = "Write a reply...",
	autoFocus = false,
	onCancel,
}: CommentInputProps) => {
	const { user } = useUser();

	const [content, setContent] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (autoFocus && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [autoFocus]);

	if (!user) return null;

	const handleSubmit = async () => {
		if (!content.trim() || isCommenting) return;

		const result = await onSubmit(content);
		if (result !== false) {
			setContent("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
		if (e.key === "Escape" && onCancel) {
			onCancel();
		}
	};

	return (
		<div className="mt-3 flex items-start space-x-3">
			<Avatar className="h-8 w-8 shrink-0">
				<AvatarImage src={user.imageUrl || "/avatar.png"} />
				<AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<Textarea
					ref={textareaRef}
					placeholder={placeholder}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={handleKeyDown}
					className="min-h-15 resize-none border-0 p-0 focus-visible:ring-0 text-sm"
					disabled={isCommenting}
				/>
				<div className="flex justify-end gap-2 mt-2">
					{onCancel && (
						<Button
							size="sm"
							variant="ghost"
							onClick={onCancel}
							disabled={isCommenting}
							className="rounded-full px-4"
						>
							Cancel
						</Button>
					)}
					<Button
						size="sm"
						onClick={handleSubmit}
						disabled={!content.trim() || isCommenting}
						className="rounded-full px-4"
					>
						{isCommenting ? (
							<>
								<span className="animate-spin mr-2">⟳</span>
								Posting...
							</>
						) : (
							"Reply"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CommentInput;
