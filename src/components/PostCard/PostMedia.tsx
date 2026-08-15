interface PostMediaProps {
	image: string;
}

const PostMedia = ({ image }: PostMediaProps) => {
	return (
		<div className="mt-3 rounded-2xl overflow-hidden border border-border">
			<div className="relative">
				<img
					src={image}
					alt="Post content"
					className="w-full h-auto object-cover max-h-128"
				/>
			</div>
		</div>
	);
};

export default PostMedia;
