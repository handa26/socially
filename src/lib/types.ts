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

export interface Post {
  id: string;
  content: string | null;
  image: string | null;
  createdAt: Date;
  author: PostAuthor;
  comments: Comment[];
  likes: Like[];
  reposts: Repost[];
  _count: {
    likes: number;
    comments: number;
    reposts: number;
  };
}