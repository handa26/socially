import { Eye, EyeOff } from "lucide-react";

interface SensitiveContentToggleProps {
	isSensitive: boolean;
	onToggle: () => void;
}

const SensitiveContentToggle = ({
	isSensitive,
	onToggle,
}: SensitiveContentToggleProps) => {
	return (
		<div className="mt-3 flex items-center gap-2">
			<button
				type="button"
				onClick={onToggle}
				className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition ${
					isSensitive
						? "bg-iconPink/20 text-iconPink hover:bg-iconPink/30"
						: "bg-borderGray text-textGray hover:bg-[#1D1F23]"
				}`}
			>
				{isSensitive ? (
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
	);
};

export default SensitiveContentToggle;
