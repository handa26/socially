import Link from "next/link";
import { TrendingUp } from "lucide-react";

const TRENDING_TOPICS = [
	{ id: 1, topic: "Next.js", posts: "52.3K", category: "Technology" },
	{ id: 2, topic: "React 19", posts: "31.2K", category: "Technology" },
	{ id: 3, topic: "Tailwind CSS", posts: "28.7K", category: "Development" },
	{ id: 4, topic: "Prisma", posts: "15.1K", category: "Database" },
	{ id: 5, topic: "AI", posts: "89.4K", category: "Technology" },
];

const Trends = () => {
	return (
		<div className="bg-[#16181C] rounded-xl p-4 border border-borderGray">
			<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
				<TrendingUp className="w-5 h-5 text-iconBlue" />
				Trends for you
			</h2>

			<div className="space-y-4">
				{TRENDING_TOPICS.map((item) => (
					<div
						key={item.id}
						className="hover:bg-[#1D1F23] transition p-2 rounded-lg cursor-pointer"
					>
						<p className="text-textGray text-xs">{item.category}</p>
						<p className="font-semibold hover:text-iconBlue transition">
							#{item.topic}
						</p>
						<p className="text-textGray text-xs">{item.posts} posts</p>
					</div>
				))}
			</div>

			<Link
				href="/trends"
				className="text-iconBlue text-sm hover:underline block mt-4"
			>
				Show more
			</Link>
		</div>
	);
};

export default Trends;
