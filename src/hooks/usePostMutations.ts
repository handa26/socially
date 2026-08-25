import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
	createPost,
	deletePost,
	toggleLike,
	createComment,
	repostPost,
	savePost,
} from "@/actions/post.action";

export const usePostMutations = () => {
	const queryClient = useQueryClient();

	// Invalidate posts query
	const invalidatePosts = () => {
		queryClient.invalidateQueries({ queryKey: ["posts"] });
	};

	const createPostMutation = useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			invalidatePosts();
			toast.success("Post created successfully!");
		},
		onError: (error) => {
			toast.error("Failed to create post");
			console.error(error);
		},
	});

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      invalidatePosts();
      toast.success("Post deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete post");
      console.error(error);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      invalidatePosts();
    },
    onError: (error) => {
      toast.error("Failed to toggle like");
      console.error(error);
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      createComment(postId, content),
    onSuccess: () => {
      invalidatePosts();
      toast.success("Reply posted!");
    },
    onError: (error) => {
      toast.error("Failed to add comment");
      console.error(error);
    },
  });

  const repostMutation = useMutation({
    mutationFn: ({ postId, comment }: { postId: string, comment?: string}) => repostPost(postId),
    onSuccess: (data) => {
      invalidatePosts();
      toast.success(data?.action === "reposted" ? "Reposted!" : "Removed repost");
    },
    onError: (error) => {
      toast.error("Failed to repost");
      console.error(error);
    },
  });

  const saveMutation = useMutation({
    mutationFn: savePost,
    onSuccess: (data) => {
      invalidatePosts();
      toast.success(data?.action === "saved" ? "Saved!" : "Removed from saves");
    },
    onError: (error) => {
      toast.error("Failed to save post");
      console.error(error);
    },
  });

	return {
		createPost: createPostMutation,
    deletePost: deletePostMutation,
    toggleLike: toggleLikeMutation,
    createComment: createCommentMutation,
    repost: repostMutation,
    save: saveMutation,
    invalidatePosts,
	};
};
