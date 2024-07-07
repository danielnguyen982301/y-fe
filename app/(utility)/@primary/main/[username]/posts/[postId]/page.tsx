'use client';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import PostCard from '@/app/ui/post/post-card';
import PostDetails from '@/app/ui/post/post-details';
import PostForm from '@/app/ui/post/post-form';
import ReplyList from '@/app/ui/reply/reply-list';
import { Box, Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const pathname = usePathname();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newReply, setNewReply] = useState<{
    reply: Reply;
    replyCount: number;
  } | null>(null);
  const [updatedTarget, setUpdatedTarget] = useState<
    Post | { reply: Reply; replyCount: number } | null
  >(null);
  const [newReplyCount, setNewReplyCount] = useState(selectedPost?.replyCount);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    const getSinglePost = async () => {
      try {
        const response = await apiService.get(`/posts/original/${postId}`);
        setSelectedPost(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSinglePost();
  }, [postId, pathname]);

  useEffect(() => {
    setNewReplyCount(
      (updatedTarget as { reply: Reply; replyCount: number })?.replyCount,
    );
  }, [updatedTarget]);

  useEffect(() => {
    setNewReplyCount(newReply?.replyCount);
  }, [newReply]);

  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
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
      </Stack>
    </Box>
  );
}
