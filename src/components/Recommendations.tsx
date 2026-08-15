import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

import FollowButton from "./FollowButton";

import { getRecommendedUsers, getUserByClerkId } from "@/actions/user.action";

const Recommendations = async () => {
	const authUser = await currentUser();
	if (!authUser) return null;

	const currentUserData = await getUserByClerkId(authUser.id);
	if (!currentUserData) return null;

	// Fetch users to recommend (excluding current user and people they follow)
	const recommendedUsers = await getRecommendedUsers(currentUserData.id);

	if (recommendedUsers.length === 0) {
		return (
			<div className="bg-[#16181C] rounded-xl p-4 border border-borderGray">
				<h2 className="text-xl font-bold mb-4">Who to follow</h2>
				<p className="text-textGray text-sm">No recommendations right now</p>
			</div>
		);
	}

	return (
		<div className="bg-[#16181C] rounded-xl p-4 border border-borderGray">
			<h2 className="text-xl font-bold mb-4">Who to follow</h2>

			<div className="space-y-4">
				{recommendedUsers.slice(0, 3).map((user) => (
					<div
						key={user.id}
						className="flex items-center justify-between hover:bg-[#1D1F23] transition p-2 rounded-lg"
					>
						<Link
							href={`/profile/${user.username}`}
							className="flex items-center gap-3 flex-1"
						>
							<div className="w-10 h-10 rounded-full overflow-hidden bg-borderGray">
								{user.image ? (
									<Image
										src={user.image}
										alt={user.name || user.username}
										width={40}
										height={40}
										className="object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-xl">
										{(user.name || user.username)[0].toUpperCase()}
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold truncate">
									{user.name || user.username}
								</p>
								<p className="text-textGray text-sm truncate">
									@{user.username}
								</p>
							</div>
						</Link>

						<FollowButton userId={user.id} />
					</div>
				))}
			</div>

			{recommendedUsers.length > 3 && (
				<Link
					href="/explore/people"
					className="text-iconBlue text-sm hover:underline block mt-4"
				>
					Show more
				</Link>
			)}
		</div>
	);
};

export default Recommendations;
