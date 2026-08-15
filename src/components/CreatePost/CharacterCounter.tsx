interface CharacterCounterProps {
	length: number;
	maxLength: number;
	isVisible: boolean;
}

const CharacterCounter = ({
	length,
	maxLength,
	isVisible,
}: CharacterCounterProps) => {
	if (!isVisible) return null;

	const isOverLimit = length > maxLength;
	const remaining = maxLength - length;

	return (
		<span
			className={`text-sm ${isOverLimit ? "text-red-500" : "text-textGray"}`}
		>
			{remaining}
		</span>
	);
};

export default CharacterCounter;
