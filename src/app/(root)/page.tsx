import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

import CreatePost from "@/components/CreatePost/CreatePost";
import PostCard from "@/components/PostCard/PostCard";

import { getDbUserId, syncUser } from "@/actions/user.action";
import { getPosts } from "@/actions/post.action";

const Homepage = async () => {
	const user = await currentUser();
	if (user) await syncUser();

	const posts = await getPosts();
	const dbUserId = await getDbUserId();

	return (
		<div className="">
			<div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b border-borderGray">
				<Link
					className="pb-3 flex items-center border-b-4 border-iconBlue"
					href="/"
				>
					For you
				</Link>
				<Link className="pb-3 flex items-center" href="/">
					Following
				</Link>
				<Link className="hidden pb-3 md:flex items-center" href="/">
					React.js
				</Link>
				<Link className="hidden pb-3 md:flex items-center" href="/">
					Javascript
				</Link>
				<Link className="hidden pb-3 md:flex items-center" href="/">
					CSS
				</Link>
			</div>

			<CreatePost />
			{posts.map((post) => (
				<PostCard key={post.id} post={post} dbUserId={dbUserId} />
			))}
		</div>
	);
};

export default Homepage;
