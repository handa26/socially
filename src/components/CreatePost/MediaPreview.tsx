// components/CreatePost/MediaPreview.tsx
import Image from "next/image";
import { X, Edit2 } from "lucide-react";

interface MediaPreviewProps {
	media: {
		previewUrl: string;
		type: "image" | "video";
	};
	onRemove: () => void;
	onEdit: () => void;
	settings: {
		type: "original" | "square" | "video";
		sensitive: boolean;
	};
}

export const MediaPreview = ({
	media,
	onRemove,
	onEdit,
	settings,
}: MediaPreviewProps) => {
	const getAspectRatio = () => {
		switch (settings.type) {
			case "square":
				return "aspect-square";
			case "video":
				return "aspect-video";
			default:
				return "aspect-auto";
		}
	};

	const getObjectFit = () => {
		switch (settings.type) {
			case "original":
				return "object-contain";
			default:
				return "object-cover";
		}
	};

	return (
		<div
			className={`relative rounded-2xl overflow-hidden border border-borderGray ${getAspectRatio()}`}
		>
			{media.type === "image" ? (
				<Image
					src={media.previewUrl}
					alt="Post media"
					width={600}
					height={600}
					className={`w-full h-full ${getObjectFit()}`}
				/>
			) : (
				<video
					src={media.previewUrl}
					controls
					className="w-full h-full object-cover"
				/>
			)}

			{/* Edit button - only for images */}
			{media.type === "image" && (
				<button
					type="button"
					onClick={onEdit}
					className="absolute top-2 left-2 bg-black/60 text-white p-1.5 rounded-full 
                             hover:bg-black/80 transition"
				>
					<Edit2 className="w-4 h-4" />
				</button>
			)}

			{/* Remove button */}
			<button
				type="button"
				onClick={onRemove}
				className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full 
                         hover:bg-black/80 transition"
			>
				<X className="w-4 h-4" />
			</button>

			{/* Sensitive content overlay */}
			{settings.sensitive && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
					<div className="bg-black/80 text-white px-6 py-3 rounded-full text-sm font-medium">
						🚫 Sensitive Content
					</div>
				</div>
			)}
		</div>
	);
};
