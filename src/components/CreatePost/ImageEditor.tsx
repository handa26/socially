"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Crop, Maximize, Video, Check } from "lucide-react";

interface ImageEditorProps {
	media: {
		previewUrl: string;
		type: "image" | "video";
	};
	settings: {
		type: "original" | "square" | "video";
		sensitive: boolean;
	};
	setSettings: (settings: any) => void;
	onClose: () => void;
}

export const ImageEditor = ({
	media,
	settings,
	setSettings,
	onClose,
}: ImageEditorProps) => {
	const [selectedOption, setSelectedOption] = useState<
		"original" | "square" | "video"
	>(settings.type);

	const aspectOptions = [
		{
			id: "original",
			label: "Original",
			icon: Maximize,
			description: "Keep original aspect ratio",
		},
		{
			id: "square",
			label: "Square (1:1)",
			icon: Crop,
			description: "Crop to square",
		},
		{
			id: "video",
			label: "Video (16:9)",
			icon: Video,
			description: "Crop to widescreen",
		},
	];

	const handleApply = () => {
		setSettings({ ...settings, type: selectedOption });
		onClose();
	};

	const getPreviewClass = () => {
		switch (selectedOption) {
			case "square":
				return "aspect-square object-cover";
			case "video":
				return "aspect-video object-cover";
			default:
				return "aspect-auto object-contain max-h-[400px]";
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
			<div className="bg-black rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-borderGray">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-borderGray">
					<h3 className="text-xl font-bold">Edit Image</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-borderGray rounded-full transition"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Image Preview */}
				<div className="p-4 bg-[#0A0A0A]">
					<div className="relative flex items-center justify-center">
						<Image
							src={media.previewUrl}
							alt="Edit preview"
							width={600}
							height={400}
							className={`w-full ${getPreviewClass()} rounded-lg`}
						/>
					</div>
				</div>

				{/* Aspect Ratio Options */}
				<div className="p-4">
					<h4 className="text-sm font-semibold text-textGray mb-3">
						Choose aspect ratio
					</h4>
					<div className="grid grid-cols-3 gap-3">
						{aspectOptions.map((option) => {
							const Icon = option.icon;
							const isSelected = selectedOption === option.id;

							return (
								<button
									key={option.id}
									type="button"
									onClick={() => setSelectedOption(option.id as any)}
									className={`p-4 rounded-xl border-2 transition text-left ${
										isSelected
											? "border-iconBlue bg-iconBlue/10"
											: "border-borderGray hover:border-borderGray"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`p-2 rounded-full ${
												isSelected ? "bg-iconBlue/20" : "bg-borderGray"
											}`}
										>
											<Icon
												className={`w-4 h-4 ${
													isSelected ? "text-iconBlue" : "text-textGray"
												}`}
											/>
										</div>
										<div>
											<p className="font-medium text-sm">{option.label}</p>
											<p className="text-xs text-textGray">
												{option.description}
											</p>
										</div>
									</div>
									{isSelected && (
										<div className="mt-2 text-iconBlue">
											<Check className="w-4 h-4" />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3 p-4 border-t border-borderGray">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 rounded-full hover:bg-borderGray transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleApply}
						className="px-6 py-2 bg-iconBlue text-white font-bold rounded-full 
                                 hover:bg-opacity-90 transition"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};
