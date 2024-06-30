'use client';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import PostCard from '@/app/ui/post/post-card';
import PostForm from '@/app/ui/post/post-form';
import ReplyList from '@/app/ui/replies/reply-list';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function Page({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newReply, setNewReply] = useState<{
    reply: Reply;
    replyCount: number;
  } | null>(null);

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await apiService.get(`/posts/${postId}`);
        setSelectedPost(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSinglePost();
  }, [postId]);

  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <PostCard post={selectedPost as Post} detailed />
        <PostForm
          setNewReply={setNewReply}
          targetType="Post"
          targetId={postId}
        />
        <ReplyList targetType="Post" targetId={postId} />
      </Stack>
    </Box>
  );
}
