'use client';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import PostCard from '@/app/ui/post/post-card';
import PostDetails from '@/app/ui/post/post-details';
import PostForm from '@/app/ui/post/post-form';
import ReplyCard from '@/app/ui/reply/reply-card';
import ReplyDetails from '@/app/ui/reply/reply-details';
import ReplyList from '@/app/ui/reply/reply-list';
import { Box, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page({ params }: { params: { replyId: string } }) {
  const { replyId } = params;
  const pathname = usePathname();
  const [replyChain, setReplyChain] = useState<(Post | Reply)[]>([]);
  const [newReply, setNewReply] = useState<{
    reply: Reply;
    replyCount: number;
  } | null>(null);

  useEffect(() => {
    const element = document.getElementById(`${replyChain.slice(-1)[0]?._id}`);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, [replyChain]);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    const getSinglePost = async () => {
      try {
        const response = await apiService.get(`/replies/original/${replyId}`);
        setReplyChain(response.data.links);
      } catch (error) {
        console.log(error);
      }
    };
    getSinglePost();
  }, [replyId, pathname]);

  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          minHeight: '1840px',
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        {!!replyChain.length &&
          replyChain.map((elem, index) =>
            index === 0 ? (
              <PostCard key={elem._id} post={elem} chained />
            ) : index === replyChain.length - 1 ? (
              <ReplyDetails
                key={elem._id}
                reply={elem as Reply}
                newReplyCount={newReply?.replyCount}
              />
            ) : (
              <ReplyCard key={elem._id} reply={elem as Reply} chained direct />
            ),
          )}
        <PostForm
          setNewReply={setNewReply}
          replyTargetType="Reply"
          replyTarget={replyChain.slice(-1)[0] as Reply}
        />
        <ReplyList
          targetType="Reply"
          targetId={replyId}
          newReply={newReply?.reply}
        />
      </Stack>
    </Box>
  );
}
