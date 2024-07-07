'use client';

import apiService from '@/app/lib/apiService';
import { Post, Reply, Thread, User } from '@/app/lib/definitions';
import { useUserData } from '@/app/lib/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PostCard from './post-card';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import ReplyCard from '../reply/reply-card';
import { usePathname } from 'next/navigation';

type PostListProps = {
  newPost?: Thread | null;
  tab?: string;
  query?: string | null;
  user?: User | null;
};

export default function PostList({ newPost, tab, query, user }: PostListProps) {
  const { data } = useSession();
  const pathname = usePathname();
  const [posts, setPosts] = useState<Thread[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedTarget, setUpdatedTarget] = useState<
    Post | { reply: Reply; replyCount: number } | null
  >(null);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    if (!data?.currentUser || !!tab) return;
    const getNewPosts = async () => {
      try {
        const response = await apiService.get(
          `/posts/user/${data.currentUser._id}`,
          {
            params: { original: true, page: currentPage },
          },
        );
        setTotalPages(response.data.totalPages);
        const newlyCreatedPosts = response.data.posts.filter((post: Thread) => {
          const postDate = new Date(post.createdAt as string);
          return Date.now() - postDate.getTime() < 1000 * 60 * 60 * 24;
        });
        setPosts(newlyCreatedPosts);
      } catch (error) {
        console.log(error);
      }
    };
    getNewPosts();
  }, [newPost, data, tab, pathname, updatedTarget, currentPage]);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    if (!tab) return;
    const getPosts = async () => {
      let response;
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
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, [tab, query, user, newPost, pathname, updatedTarget, currentPage]);

  return (
    <Stack sx={{ width: '100%' }}>
      {!!posts.length && (
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={posts.length >= 10 && currentPage < totalPages}
          loader={<h4>Loading...</h4>}
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
                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
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
