import { Stack } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

import apiService from '@/app/lib/apiService';
import { Post, Reply, User } from '@/app/lib/definitions';
import ReplyCard from './reply-card';
import LoadingScreen from '../loading-screen';

export default function ReplyList({
  user,
  targetType,
  targetId,
  newReply,
  setNewUpdatedTarget,
  newUpdatedTarget,
}: {
  user?: User;
  targetType?: 'Post' | 'Reply';
  targetId?: string;
  newReply?: Reply | null;
  setNewUpdatedTarget?: Dispatch<
    SetStateAction<Post | { reply: Reply; replyCount: number } | null>
  >;
  newUpdatedTarget?: { reply: Reply; replyCount: number };
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedTarget, setUpdatedTarget] = useState<
    Post | { reply: Reply; replyCount: number } | null
  >(null);
  const isOnComposeRoute = pathname.includes('compose');

  useEffect(() => {
    if (isOnComposeRoute) return;
    const getReplies = async () => {
      let response;
      setLoading(true);
      try {
        if (targetId && targetType) {
          response = await apiService.get(
            `/replies/target/${targetType.toLowerCase()}/${targetId}`,
          );
        }
        if (user) {
          response = await apiService.get(`/replies/user/${user._id}`);
        }
        if (response) {
          setTotalPages(response.data.totalPages);
          const axiosResponse = response;
          currentPage === 1
            ? setReplies(response.data.replies)
            : setReplies((prevState) => [
                ...prevState,
                ...axiosResponse?.data.replies,
              ]);
        }
        setLoading(false);
      } catch (error) {}
    };
    getReplies();
  }, [
    targetType,
    targetId,
    newReply,
    user,
    updatedTarget,
    newUpdatedTarget,
    isOnComposeRoute,
    currentPage,
  ]);

  return loading && currentPage === 1 ? (
    <LoadingScreen />
  ) : (
    <Stack sx={{ width: '100%' }}>
      {!!replies?.length && (
        <InfiniteScroll
          dataLength={replies.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={replies.length >= 10 && currentPage < totalPages}
          loader={<LoadingScreen />}
        >
          {replies.map((reply) => (
            <ReplyCard
              key={reply._id}
              reply={reply}
              direct={!!targetId}
              setUpdatedTarget={setNewUpdatedTarget ?? setUpdatedTarget}
            />
          ))}
        </InfiniteScroll>
      )}
    </Stack>
  );
}
