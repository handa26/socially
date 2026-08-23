export interface PostAuthor {
  id: string;
  name: string | null;
  image: string | null;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: PostAuthor;
}

export interface Like {
  userId: string;
}

export interface Repost {
  userId: string;
}

export interface Saves {
  userId: string;
}

export interface Post {
  id: string;
  content: string | null;
  image: string | null;
  createdAt: Date;
  author: PostAuthor;
  comments: Comment[];
  likes: Like[];
  reposts: Repost[];
  repostedBy?: {
    name: string | undefined;
  }
  _count: {
    likes: number;
    comments: number;
    reposts: number;
  };
  video: string;
	mediaType: "video" | "image";
	isSensitive: boolean;
	aspectRatio: "string";
  saves?: Saves[];
}

export interface Notification {
  id: string;
  userId: string;
  creatorId: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "REPOST" | "SAVE";
  read: boolean;
  postId: string | null;
  commentId: string | null;
  createdAt: Date;
  creator: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  post: {
    id: string;
    content: string | null;
    image: string | null;
    authorId: string;
    author: {
      username: string;
    };
  } | null;
  comment: {
    id: string;
    content: string;
    createdAt: Date;
  } | null;
}