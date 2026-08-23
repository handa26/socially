import { Metadata } from "next";
import Link from "next/link";
import { Bookmark, BookOpen, ArrowLeft } from "lucide-react";

import PostCard from "@/components/PostCard/PostCard";
import { Button } from "@/components/ui/button";

import { getUserSavedPosts } from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.action";

export const metadata: Metadata = {
	title: "Bookmarks",
	description: "Your saved posts",
};

const BookmarksPage = async () => {
	const dbUserId = await getDbUserId();

	if (!dbUserId) return;

	const savedPosts = await getUserSavedPosts(dbUserId);

	return (
		<div className="max-w-150 mx-auto">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
				<div className="flex items-center gap-4 px-4 h-14">
					<Link
						href="/"
						className="p-2 -ml-2 rounded-full hover:bg-accent/50 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<h1 className="font-bold text-xl">Bookmarks</h1>
						<p className="text-sm text-muted-foreground">
							{savedPosts.length} saved{" "}
							{savedPosts.length === 1 ? "post" : "posts"}
						</p>
					</div>
				</div>
			</div>

			{/* Content */}
			{savedPosts.length === 0 ? (
				<div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
					<div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
						<BookOpen className="w-10 h-10 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-semibold">No bookmarks yet</h2>
					<p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
						Save posts you want to remember by clicking the bookmark icon on any
						post.
					</p>
					<Link href="/">
						<Button className="mt-4">Browse Posts</Button>
					</Link>
				</div>
			) : (
				<div className="divide-y divide-border">
					{savedPosts.map((post) => (
						<div key={post.id} className="relative">
							<PostCard post={post} dbUserId={dbUserId} />
							{/* Optional: Show when it was saved */}
							<div className="absolute bottom-2 right-4 text-xs text-muted-foreground">
								Saved {new Date(post.savedAt).toLocaleDateString()}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default BookmarksPage;
