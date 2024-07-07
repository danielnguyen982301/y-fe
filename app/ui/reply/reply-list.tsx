import apiService from '@/app/lib/apiService';
import { Post, Reply, User } from '@/app/lib/definitions';
import { Stack } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ReplyCard from './reply-card';
import { usePathname } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [replies, setReplies] = useState<Reply[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedTarget, setUpdatedTarget] = useState<
    Post | { reply: Reply; replyCount: number } | null
  >(null);

  useEffect(() => {
    if (pathname.includes('compose')) return;
    const getReplies = async () => {
      let response;
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
      } catch (error) {
        console.log(error);
      }
    };
    getReplies();
  }, [
    targetType,
    targetId,
    newReply,
    user,
    updatedTarget,
    newUpdatedTarget,
    pathname,
    currentPage,
  ]);

  return (
    <Stack sx={{ width: '100%' }}>
      {!!replies?.length && (
        <InfiniteScroll
          dataLength={replies.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={replies.length >= 10 && currentPage < totalPages}
          loader={<h4>Loading...</h4>}
        >
          {replies.map((reply) => (
            <ReplyCard
              key={reply._id}
              reply={reply}
              direct={targetId ? true : false}
              setUpdatedTarget={setNewUpdatedTarget ?? setUpdatedTarget}
            />
          ))}
        </InfiniteScroll>
      )}
    </Stack>
  );
}
