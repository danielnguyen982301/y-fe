'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Box, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import LoadingScreen from '@/app/ui/loading-screen';
import PostDetails from '@/app/ui/post/post-details';
import PostForm from '@/app/ui/post/post-form';
import ReplyList from '@/app/ui/reply/reply-list';
import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';

export default function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newReply, setNewReply] = useState<{
    reply: Reply;
    replyCount: number;
  } | null>(null);
  const [updatedTarget, setUpdatedTarget] = useState<
    Post | { reply: Reply; replyCount: number } | null
  >(null);
  const [newReplyCount, setNewReplyCount] = useState(selectedPost?.replyCount);
  const isOnComposeRoute = pathname.includes('compose');

  useEffect(() => {
    if (isOnComposeRoute) return;
    const getSinglePost = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/posts/original/${postId}`);
        setSelectedPost(response.data);
        setLoading(false);
      } catch (error) {}
    };
    getSinglePost();
  }, [postId, isOnComposeRoute]);

  useEffect(() => {
    setNewReplyCount(
      (updatedTarget as { reply: Reply; replyCount: number })?.replyCount,
    );
  }, [updatedTarget]);

  useEffect(() => {
    setNewReplyCount(newReply?.replyCount);
  }, [newReply]);

  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          width: { xs: '100%', sm: '500px', lg: '600px' },
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box
          onClick={() => router.back()}
          sx={{ px: 1, pt: 1, cursor: 'pointer' }}
        >
          <ArrowLeftIcon width={20} height={20} />
        </Box>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <PostDetails
              post={selectedPost as Post}
              newReplyCount={newReplyCount}
            />
            <PostForm
              setNewReply={setNewReply}
              replyTargetType="Post"
              replyTarget={selectedPost as Post}
            />
            <ReplyList
              targetType="Post"
              targetId={postId}
              newReply={newReply?.reply}
              setNewUpdatedTarget={setUpdatedTarget}
              newUpdatedTarget={
                updatedTarget as { reply: Reply; replyCount: number }
              }
            />
          </>
        )}
      </Stack>
      <Stack
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '300px',
          height: '100vh',
          ml: { lg: '20px', md: '10px' },
          position: 'sticky',
          top: 0,
        }}
        spacing={4}
      >
        <SearchBar query="" />
        <TrendingTagList />
      </Stack>
    </Box>
  );
}
