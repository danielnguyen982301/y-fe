// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type Follow = {
  follower: string;
  followee: string;
};

export type User = {
  _id: string;
  username: string;
  displayName: string;
  avatar?: string;
  header?: string;
  bio: string;
  location: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  relationship?: string;
  createdAt: string;
  [key: string]: any;
};

export type Post = {
  _id: string;
  author: User;
  content: string;
  mediaFile?: string;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  viewCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
};

export type Reply = {
  _id: string;
  author: User;
  content: string;
  mediaFile?: string;
  targetType: 'Post' | 'Reply';
  target: Post | Reply | string;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  viewCount: number;
  bookmarkCount: number;
  links: (Post | Reply | string)[];
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
};

export type Thread = {
  _id: string;
  user: User;
  post?: Post;
  reply?: Reply;
  repostType?: 'Post' | 'Reply';
  repost?: Post;
  createdAt: string;
  [key: string]: any;
};

export type Hashtag = {
  _id: string;
  name: string;
  posts: string[];
};

export type Like = {
  author: User;
  targetType: 'Post' | 'Reply';
  target: Post | Reply;
  [key: string]: any;
};

export type Bookmark = {
  user: User;
  targetType: 'Post' | 'Reply';
  target: Post | Reply;
  [key: string]: any;
};

export type Message = {
  _id: string;
  content: string;
  from: string;
  to: string;
  isRead: boolean;
  createdAt: string;
  [key: string]: any;
};

export type ChatUser = User & {
  messages: Message[];
};

export type Notification = {
  _id: string;
  sender: User;
  event: 'mention' | 'repost' | 'reply' | 'follow';
  recipient: string;
  mentionLocationType?: 'Post' | 'Reply';
  mentionLocation?: Post | Reply;
  repostType?: 'Post' | 'Reply';
  repost?: Post | Reply;
  reply?: Reply;
  isRead: boolean;
};
