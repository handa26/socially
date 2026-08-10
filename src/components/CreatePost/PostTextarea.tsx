interface PostTextareaProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

const PostTextarea = ({ value, onChange, disabled }: PostTextareaProps) => {
	return (
		<textarea
			placeholder="What's happening?"
			className="w-full bg-transparent border-none outline-none resize-none text-xl placeholder:text-textGray"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
			maxLength={280}
		/>
	);
};

export default PostTextarea;
