"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaPreview } from "./MediaPreview";
import { ImageEditor } from "./ImageEditor";
import PostTextarea from "./PostTextarea";
import PostActions from "./PostActions";
import SensitiveContentToggle from "./SensitiveContentToggle";
import CharacterCounter from "./CharacterCounter";
import PostButton from "./PostButton";

import { cn } from "@/lib/utils";
import { usePostMutations } from "@/hooks/usePostMutations";

interface MediaFile {
	file: File;
	previewUrl: string;
	type: "image" | "video";
}

interface Settings {
	type: "original" | "square" | "video";
	sensitive: boolean;
}

const CreatePost = ({ isModal = false }: { isModal?: boolean }) => {
	const { user } = useUser();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { createPost: createPostMutation } = usePostMutations();

	const [content, setContent] = useState("");
	const [media, setMedia] = useState<MediaFile | null>(null);
	const [settings, setSettings] = useState<Settings>({
		type: "original",
		sensitive: false,
	});
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isPosting, setIsPosting] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size (max 10MB for images, 32MB for videos)
		if (file.size > 32 * 1024 * 1024) {
			toast.error("File size too large. Max 32MB");
			return;
		}

		const previewUrl = URL.createObjectURL(file);
		const type = file.type.startsWith("video/") ? "video" : "image";

		setMedia({
			file,
			previewUrl,
			type,
		});

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleRemoveMedia = () => {
		if (media?.previewUrl) {
			URL.revokeObjectURL(media.previewUrl);
		}
		setMedia(null);
		setSettings({ type: "original", sensitive: false });
	};

	const handleSubmit = async () => {
		if (!content.trim() && !media) {
			toast.error("Please add some content");
			return;
		}

		// Upload media first if exists
		let uploadedMediaUrl = null;
		if (media) {
			setIsUploading(true);
			try {
				const formData = new FormData();
				formData.append("file", media.file);

				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				const data = await response.json();
				if (!response.ok) throw new Error(data.error);
				uploadedMediaUrl = data.url;
			} catch (error) {
				toast.error("Failed to upload media");
				setIsUploading(false);
				return;
			}
			setIsUploading(false);
		}

		// Create post using mutation
		createPostMutation.mutate({
			content,
			mediaUrl: uploadedMediaUrl,
			mediaType: media?.type || null,
			isSensitive: settings.sensitive,
			aspectRatio: settings.type,
		});

		// Reset form
		setContent("");
		handleRemoveMedia();
	};

	const getCharacterCount = () => {
		return 280 - content.length;
	};

	const isOverLimit = content.length > 280;
	const isDisabled =
		(!content.trim() && !media) || isPosting || isUploading || isOverLimit;

	if (!user) return null;

	return (
		<div
			className={cn(
				"border-b border-borderGray p-4",
				isModal && "border-none pt-2",
			)}
		>
			<div className="flex gap-3">
				{/* Avatar */}
				<Avatar className="shrink-0" size="lg">
					{user.imageUrl && <AvatarImage src={user.imageUrl} />}
					<AvatarFallback>
						{(user.username || "U")[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>

				{/* Content Area */}
				<div className="flex-1 min-w-0">
					{/* Text Input */}
					<PostTextarea
						value={content}
						onChange={setContent}
						disabled={isPosting}
					/>

					{/* Media Preview */}
					{media && (
						<div className="mt-3 relative">
							<MediaPreview
								media={media}
								onRemove={handleRemoveMedia}
								onEdit={() => setIsEditorOpen(true)}
								settings={settings}
							/>
						</div>
					)}

					{/* Image Editor Modal */}
					{isEditorOpen && media && (
						<ImageEditor
							media={media}
							settings={settings}
							setSettings={setSettings}
							onClose={() => setIsEditorOpen(false)}
						/>
					)}

					{/* Sensitive Content Toggle */}
					{media && (
						<SensitiveContentToggle
							isSensitive={settings.sensitive}
							onToggle={() =>
								setSettings((prev) => ({
									...prev,
									sensitive: !prev.sensitive,
								}))
							}
						/>
					)}

					{/* Actions Bar */}
					<div className="flex items-center justify-between py-3 border-t border-borderGray">
						<PostActions
							onFileSelect={handleFileSelect}
							onEmojiToggle={() => setShowEmojiPicker(!showEmojiPicker)}
							showEmojiPicker={showEmojiPicker}
							disabled={isPosting}
							fileInputRef={fileInputRef}
						/>

						<div className="flex items-center gap-3">
							<CharacterCounter
								length={content.length}
								maxLength={280}
								isVisible={content.length > 0}
							/>
							<PostButton
								onClick={handleSubmit}
								isDisabled={isDisabled}
								isPosting={isPosting}
								isUploading={isUploading}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatePost;
