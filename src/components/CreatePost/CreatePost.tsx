"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
	ImageIcon,
	GiftIcon,
	BarChart2,
	Smile,
	Calendar,
	MapPin,
	X,
	Loader2,
	Send,
	Eye,
	EyeOff,
} from "lucide-react";

import { MediaPreview } from "./MediaPreview";
import { ImageEditor } from "./ImageEditor";
import { createPost } from "@/actions/post.action";

interface MediaFile {
	file: File;
	previewUrl: string;
	type: "image" | "video";
}

interface Settings {
	type: "original" | "square" | "video";
	sensitive: boolean;
}

const CreatePost = () => {
	const { user } = useUser();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

		setIsPosting(true);

		try {
			// Upload media first if exists
			let uploadedMediaUrl = null;
			if (media) {
				setIsUploading(true);
				const formData = new FormData();
				formData.append("file", media.file);

				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				const data = await response.json();
				if (!response.ok) throw new Error(data.error);
				uploadedMediaUrl = data.url;
				setIsUploading(false);
			}

			// Create post
			const result = await createPost({
				content,
				mediaUrl: uploadedMediaUrl,
				mediaType: media?.type || null,
				isSensitive: settings.sensitive,
				aspectRatio: settings.type,
			});

			if (result.success) {
				toast.success("Post created successfully!");
				setContent("");
				handleRemoveMedia();
				router.refresh();
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error("Failed to create post:", error);
			toast.error("Failed to create post");
		} finally {
			setIsPosting(false);
			setIsUploading(false);
		}
	};

	const getCharacterCount = () => {
		return 280 - content.length;
	};

	const isOverLimit = content.length > 280;

	if (!user) return null;

	return (
		<div className="border-b border-borderGray p-4">
			<div className="flex gap-3">
				{/* Avatar */}
				<div className="shrink-0">
					<div className="w-10 h-10 rounded-full overflow-hidden bg-borderGray">
						{user.imageUrl ? (
							<Image
								src={user.imageUrl}
								alt={user.username || "User"}
								width={40}
								height={40}
								className="object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-xl text-white">
								{(user.username || "U")[0].toUpperCase()}
							</div>
						)}
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1 min-w-0">
					{/* Text Input */}
					<textarea
						placeholder="What's happening?"
						className="w-full bg-transparent border-none outline-none resize-none text-xl placeholder:text-textGray min-h-20"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						disabled={isPosting}
						maxLength={280}
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
						<div className="mt-3 flex items-center gap-2">
							<button
								type="button"
								onClick={() =>
									setSettings((prev) => ({
										...prev,
										sensitive: !prev.sensitive,
									}))
								}
								className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition ${
									settings.sensitive
										? "bg-iconPink/20 text-iconPink hover:bg-iconPink/30"
										: "bg-borderGray text-textGray hover:bg-[#1D1F23]"
								}`}
							>
								{settings.sensitive ? (
									<>
										<EyeOff className="w-4 h-4" />
										Sensitive Content
									</>
								) : (
									<>
										<Eye className="w-4 h-4" />
										Mark as Sensitive
									</>
								)}
							</button>
						</div>
					)}

					{/* Actions Bar */}
					<div className="flex items-center justify-between mt-3 pt-3 border-t border-borderGray">
						<div className="flex items-center gap-1">
							{/* Media Upload Button */}
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
								disabled={isPosting}
							>
								<ImageIcon className="w-5 h-5" />
							</button>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*,video/*"
								onChange={handleFileSelect}
								className="hidden"
								multiple={false}
							/>

							{/* GIF Button */}
							<button
								type="button"
								className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
								disabled={isPosting}
							>
								<GiftIcon className="w-5 h-5" />
							</button>

							{/* Poll Button */}
							<button
								type="button"
								className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
								disabled={isPosting}
							>
								<BarChart2 className="w-5 h-5" />
							</button>

							{/* Emoji Button */}
							<button
								type="button"
								className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
								onClick={() => setShowEmojiPicker(!showEmojiPicker)}
								disabled={isPosting}
							>
								<Smile className="w-5 h-5" />
							</button>

							{/* Schedule Button */}
							<button
								type="button"
								className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
								disabled={isPosting}
							>
								<Calendar className="w-5 h-5" />
							</button>

							{/* Location Button */}
							<button
								type="button"
								className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
								disabled={isPosting}
							>
								<MapPin className="w-5 h-5" />
							</button>
						</div>

						<div className="flex items-center gap-3">
							{/* Character Count */}
							{content.length > 0 && (
								<span
									className={`text-sm ${
										isOverLimit ? "text-red-500" : "text-textGray"
									}`}
								>
									{getCharacterCount()}
								</span>
							)}

							{/* Post Button */}
							<button
								type="button"
								onClick={handleSubmit}
								disabled={
									(!content.trim() && !media) ||
									isPosting ||
									isUploading ||
									isOverLimit
								}
								className="bg-iconBlue text-white font-bold rounded-full px-6 py-2 
                                         hover:bg-opacity-90 transition disabled:opacity-50 
                                         disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isPosting || isUploading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										{isUploading ? "Uploading..." : "Posting..."}
									</>
								) : (
									<>
										<Send className="w-4 h-4" />
										Post
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatePost;
