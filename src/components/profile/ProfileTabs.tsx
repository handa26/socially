"use client";

import { FileTextIcon, HeartIcon, Repeat2Icon, GridIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCard from "@/components/PostCard/PostCard";

import { cn } from "@/lib/utils";

interface ProfileTabsProps {
	posts: any[];
	reposts: any[];
	likedPosts: any[];
	dbUserId: string | null;
}

const ProfileTabs = ({
	posts,
	reposts,
	likedPosts,
	dbUserId,
}: ProfileTabsProps) => {
	const tabs = [
		{
			value: "posts",
			icon: GridIcon,
			label: "Posts",
			count: posts.length,
			content: posts,
		},
		{
			value: "reposts",
			icon: Repeat2Icon,
			label: "Reposts",
			count: reposts.length,
			content: reposts,
		},
		{
			value: "likes",
			icon: HeartIcon,
			label: "Likes",
			count: likedPosts.length,
			content: likedPosts,
		},
	];

	return (
		<Tabs defaultValue="posts" className="w-full">
			<TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 
                     data-[state=active]:border-primary data-[state=active]:bg-transparent 
                     px-6 py-3 font-semibold hover:bg-accent/50 transition-colors"
					>
						<tab.icon className="h-4 w-4" />
						<span>{tab.label}</span>
						{tab.count > 0 && (
							<span className="text-xs text-muted-foreground ml-1">
								{tab.count}
							</span>
						)}
					</TabsTrigger>
				))}
			</TabsList>

			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value} className="mt-0">
					{tab.content.length > 0 ? (
						<div className="divide-y divide-border">
							{tab.content.map((post) => (
								<PostCard
									key={post.id}
									post={post}
									dbUserId={dbUserId}
									isRepost={tab.value === "reposts"}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="rounded-full bg-muted p-3 mb-3">
								<tab.icon className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="font-semibold text-lg">
								No {tab.label.toLowerCase()}
							</h3>
							<p className="text-muted-foreground text-sm mt-1">
								{tab.value === "posts" &&
									"When you post something, it will show up here."}
								{tab.value === "reposts" &&
									"When you repost something, it will show up here."}
								{tab.value === "likes" &&
									"When you like something, it will show up here."}
							</p>
						</div>
					)}
				</TabsContent>
			))}
		</Tabs>
	);
};

export default ProfileTabs;
