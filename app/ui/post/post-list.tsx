'use client';

import apiService from '@/app/lib/apiService';
import { Post, Thread, User } from '@/app/lib/definitions';
import { useUserData } from '@/app/lib/hooks';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PostCard from './post-card';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

type PostListProps = {
  newPost?: Thread | null;
  tab?: string;
  query?: string | null;
  user?: User | null;
};

export default function PostList({ newPost, tab, query, user }: PostListProps) {
  const { data } = useSession();
  const [posts, setPosts] = useState<Thread[]>([]);

  useEffect(() => {
    if (!data?.currentUser || !!tab) return;
    const getNewPosts = async () => {
      try {
        const response = await apiService.get(
          `/posts/user/${data.currentUser._id}`,
          {
            params: { original: true },
          },
        );
        const newlyCreatedPosts = response.data.posts.filter((post: Thread) => {
          const postDate = new Date(post.post?.createdAt as string);
          return Date.now() - postDate.getTime() < 1000 * 60 * 60 * 24;
        });
        setPosts(newlyCreatedPosts);
      } catch (error) {
        console.log(error);
      }
    };
    getNewPosts();
  }, [newPost, data, tab]);

  useEffect(() => {
    if (!tab) return;
    const getPosts = async () => {
      let response;
      try {
        if (tab === 'Following') {
          response = await apiService.get('/posts/followees');
        }
        if (tab === 'For You') {
          response = await apiService.get('/posts', {
            params: { ignoreCurrent: true },
          });
        }
        if (tab === 'Searched Posts' && !!query) {
          response = await apiService.get('/posts', {
            params: { searchText: query },
          });
        }
        if (tab === 'Posts' && !!user) {
          response = await apiService.get(`/posts/user/${user?._id}`);
        }
        if (response) setPosts(response?.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, [tab, query, user]);

  return (
    <Stack sx={{ width: '100%' }}>
      {/* {newPosts &&
        newPosts.map(
          (newPost) =>
            newPost.post && <PostCard key={newPost._id} post={newPost.post} />,
        )} */}
      {!!posts.length &&
        posts.map((post) =>
          post.post ? (
            <PostCard key={post._id} post={post.post} />
          ) : (
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
              <PostCard post={post.repost as Post} />
            </Stack>
          ),
        )}
    </Stack>
  );
}
