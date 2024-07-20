import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import apiService from '@/app/lib/apiService';
import { Like, Reply, User } from '@/app/lib/definitions';
import ReplyCard from '../reply/reply-card';
import PostCard from '../post/post-card';
import LoadingScreen from '../loading-screen';

export default function LikeList({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getLikedTargets = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/likes/user/${user?._id}`);
        setTotalPages(response.data.totalPages);
        currentPage === 1
          ? setLikes(response.data.likes)
          : setLikes((prevState) => [...prevState, ...response.data.likes]);
        setLoading(false);
      } catch (error) {}
    };
    getLikedTargets();
  }, [user, currentPage]);

  return loading && currentPage === 1 ? (
    <LoadingScreen />
  ) : (
    <Stack sx={{ width: '100%' }}>
      {!!likes?.length && (
        <InfiniteScroll
          dataLength={likes.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={likes.length >= 10 && currentPage < totalPages}
          loader={<LoadingScreen />}
        >
          {likes.map((like) =>
            like.targetType === 'Reply' ? (
              <ReplyCard key={like.target._id} reply={like.target as Reply} />
            ) : (
              <PostCard key={like.target._id} post={like.target} />
            ),
          )}
        </InfiniteScroll>
      )}
    </Stack>
  );
}
