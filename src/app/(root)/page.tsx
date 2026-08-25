import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

import CreatePost from "@/components/CreatePost/CreatePost";
import Feed from "@/components/Feed";
import InfiniteFeed from "@/components/InfiniteFeed";

import { getDbUserId, syncUser } from "@/actions/user.action";

const Homepage = async () => {
	const user = await currentUser();
	if (user) await syncUser();

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
			<InfiniteFeed dbUserId={dbUserId} />
		</div>
	);
};

export default Homepage;
