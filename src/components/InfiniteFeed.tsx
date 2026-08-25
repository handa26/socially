"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";

import PostCard from "@/components/PostCard/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface InfiniteFeedProps {
  dbUserId: string | null;
  userProfileId?: string;
}

const fetchPosts = async ({ pageParam = null, userProfileId }: any) => {
  const url = new URL("/api/posts", window.location.origin);
  
  if (pageParam) {
    url.searchParams.set("cursor", pageParam);
  }
  
  if (userProfileId) {
    url.searchParams.set("user", userProfileId);
  }
  
  url.searchParams.set("limit", "10");

  const res = await fetch(url.toString());
  
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  
  return res.json();
};

const InfiniteFeed = ({ dbUserId, userProfileId }: InfiniteFeedProps) => {
  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", userProfileId],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, userProfileId }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (status === "pending") {
    return (
      <div className="divide-y divide-border">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-red-500 font-medium">Something went wrong</p>
        <p className="text-sm text-muted-foreground mt-1">
          Failed to load posts. Please try again.
        </p>
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-lg">No posts yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {userProfileId
            ? "This user hasn't posted anything yet."
            : "Follow some users to see their posts here."}
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
      endMessage={
        <div className="text-center py-6 text-sm text-muted-foreground">
          You've seen all posts! 🎉
        </div>
      }
      scrollThreshold="200px"
    >
      <div className="divide-y divide-border">
        {allPosts.map((post: any) => (
          <PostCard
            key={post._key || post.id}
            post={post}
            dbUserId={dbUserId}
            isRepost={post.isRepost}
          />
        ))}
      </div>
    </InfiniteScroll>
  )
}

export default InfiniteFeed