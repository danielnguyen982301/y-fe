'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import apiService from '@/app/lib/apiService';
import { Post, Reply, Thread, User } from '@/app/lib/definitions';
import PostCard from './post-card';
import ReplyCard from '../reply/reply-card';
import LoadingScreen from '../loading-screen';

type PostListProps = {
  newPost?: Thread | null;
  tab?: string;
  query?: string | null;
  user?: User | null;
};

export default function PostList({ newPost, tab, query, user }: PostListProps) {
  const { data } = useSession();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Thread[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedTarget, setUpdatedTarget] = useState<
    Post | { reply: Reply; replyCount: number } | null
  >(null);
  const [currentUserId, setCurrentUserId] = useState(data?.currentUser._id);

  useEffect(() => {
    if (!data) return;
    setCurrentUserId(data.currentUser._id);
  }, [data]);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    if (!currentUserId || !!tab) return;
    const getNewPosts = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/posts/user/${currentUserId}`, {
          params: { original: true, page: currentPage },
        });
        setTotalPages(response.data.totalPages);
        const newlyCreatedPosts = response.data.posts.filter((post: Thread) => {
          const postDate = new Date(post.createdAt as string);
          return Date.now() - postDate.getTime() < 1000 * 60 * 60 * 24;
        });
        currentPage === 1
          ? setPosts(newlyCreatedPosts)
          : setPosts((prevState) => [...prevState, ...newlyCreatedPosts]);
        setLoading(false);
      } catch (error) {}
    };
    getNewPosts();
  }, [newPost, currentUserId, tab, pathname, updatedTarget, currentPage]);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    if (!tab) return;
    const getPosts = async () => {
      let response;
      setLoading(true);
      try {
        if (tab === 'Following') {
          response = await apiService.get('/posts/followees', {
            params: { page: currentPage },
          });
        }
        if (tab === 'For You') {
          response = await apiService.get('/posts', {
            params: { ignoreCurrent: true, page: currentPage },
          });
        }
        if (tab === 'Searched Posts' && !!query) {
          response = await apiService.get('/posts', {
            params: { searchText: query, page: currentPage },
          });
        }
        if (tab === 'Posts' && user) {
          response = await apiService.get(`/posts/user/${user?._id}`, {
            params: { page: currentPage },
          });
        }
        if (response) {
          setTotalPages(response.data.totalPages);
          const axiosResponse = response;
          currentPage === 1
            ? setPosts(response.data.posts)
            : setPosts((prevState) => [
                ...prevState,
                ...axiosResponse?.data.posts,
              ]);
        }
        setLoading(false);
      } catch (error) {}
    };
    getPosts();
  }, [tab, query, user, newPost, pathname, updatedTarget, currentPage]);

  return loading && currentPage === 1 ? (
    <LoadingScreen />
  ) : (
    <Stack sx={{ width: '100%' }}>
      {!!posts.length && (
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={posts.length >= 10 && currentPage < totalPages}
          loader={<LoadingScreen />}
        >
          {posts.map((post) =>
            post.post ? (
              <PostCard
                key={post._id}
                post={post.post}
                setUpdatedTarget={setUpdatedTarget}
              />
            ) : post.repost ? (
              <Stack key={post._id} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <ArrowPathRoundedSquareIcon width={18} height={18} />
                  </Box>
                  <Box
                    sx={{
                      pl: 1,
                      color: 'rgb(83, 100, 113)',
                      fontWeight: 400,
                      fontSize: 15,
                    }}
                  >
                    {post.user._id === data?.currentUser?._id
                      ? 'You'
                      : post.user.displayName}{' '}
                    reposted
                  </Box>
                </Box>
                {post.repostType === 'Post' ? (
                  <PostCard
                    key={post._id}
                    post={post.repost as Post}
                    setUpdatedTarget={setUpdatedTarget}
                  />
                ) : (
                  <ReplyCard
                    key={post._id}
                    reply={post.repost as Reply}
                    setUpdatedTarget={setUpdatedTarget}
                  />
                )}
              </Stack>
            ) : (
              <ReplyCard
                key={post._id}
                reply={post.reply as Reply}
                setUpdatedTarget={setUpdatedTarget}
              />
            ),
          )}
        </InfiniteScroll>
      )}
    </Stack>
  );
}
