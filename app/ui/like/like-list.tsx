import apiService from '@/app/lib/apiService';
import { Like, Reply, User } from '@/app/lib/definitions';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReplyCard from '../reply/reply-card';
import PostCard from '../post/post-card';

export default function LikeList({ user }: { user: User }) {
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    const getLikedTargets = async () => {
      try {
        const response = await apiService.get(`/likes/user/${user?._id}`);
        setLikes(response.data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    getLikedTargets();
  }, [user]);

  return (
    <Stack sx={{ width: '100%' }}>
      {!!likes?.length &&
        likes.map((like) =>
          like.targetType === 'Reply' ? (
            <ReplyCard key={like.target._id} reply={like.target as Reply} />
          ) : (
            <PostCard key={like.target._id} post={like.target} />
          ),
        )}
    </Stack>
  );
}
