import { useRef } from "react";
import {
	ImageIcon,
	GiftIcon,
	BarChart2,
	Smile,
	Calendar,
	MapPin,
} from "lucide-react";

interface PostActionsProps {
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onEmojiToggle: () => void;
	showEmojiPicker: boolean;
	disabled?: boolean;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const PostActions = ({
	onFileSelect,
	onEmojiToggle,
	showEmojiPicker,
	disabled,
	fileInputRef,
}: PostActionsProps) => {
	const actionButtons = [
		{
			icon: ImageIcon,
			onClick: () => fileInputRef.current?.click(),
			label: "Media",
		},
		{
			icon: GiftIcon,
			onClick: () => {},
			label: "GIF",
		},
		{
			icon: BarChart2,
			onClick: () => {},
			label: "Poll",
		},
		{
			icon: Smile,
			onClick: onEmojiToggle,
			label: "Emoji",
		},
		{
			icon: Calendar,
			onClick: () => {},
			label: "Schedule",
		},
		{
			icon: MapPin,
			onClick: () => {},
			label: "Location",
		},
	];

	return (
		<div className="flex items-center gap-1">
			{actionButtons.map((button, index) => (
				<button
					key={index}
					type="button"
					onClick={button.onClick}
					className="p-2 hover:bg-iconBlue/10 rounded-full transition text-iconBlue"
					disabled={disabled}
					aria-label={button.label}
				>
					<button.icon className="w-5 h-5" />
				</button>
			))}

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,video/*"
				onChange={onFileSelect}
				className="hidden"
				multiple={false}
			/>
		</div>
	);
};

export default PostActions;
