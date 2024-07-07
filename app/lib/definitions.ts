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

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
