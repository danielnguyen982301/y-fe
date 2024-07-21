'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Box, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import LoadingScreen from '@/app/ui/loading-screen';
import PostCard from '@/app/ui/post/post-card';
import PostForm from '@/app/ui/post/post-form';
import ReplyCard from '@/app/ui/reply/reply-card';
import ReplyDetails from '@/app/ui/reply/reply-details';
import ReplyList from '@/app/ui/reply/reply-list';
import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';

export default function Page({ params }: { params: { replyId: string } }) {
  const { replyId } = params;
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [replyChain, setReplyChain] = useState<(Post | Reply)[]>([]);
  const [newReply, setNewReply] = useState<{
    reply: Reply;
    replyCount: number;
  } | null>(null);
  const isOnComposeRoute = pathname.includes('compose');

  useEffect(() => {
    const element = document.getElementById(`${replyChain.slice(-1)[0]?._id}`);
    if (element) element.scrollIntoView({ behavior: 'instant' });
  }, [replyChain]);

  useEffect(() => {
    if (isOnComposeRoute) return;
    const getSinglePost = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/replies/original/${replyId}`);
        setReplyChain(response.data.links);
        setLoading(false);
      } catch (error) {}
    };
    getSinglePost();
  }, [replyId, isOnComposeRoute]);

  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          minHeight: '1840px',
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
                  <ReplyCard
                    key={elem._id}
                    reply={elem as Reply}
                    chained
                    direct
                  />
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
