import apiService from '@/app/lib/apiService';
import { Reply } from '@/app/lib/definitions';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReplyCard from './reply-card';

export default function ReplyList({
  targetType,
  targetId,
}: {
  targetType: 'Post' | 'Reply';
  targetId: string;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const getReplies = async () => {
      try {
        const response = await apiService.get(
          `/replies/${targetType}/${targetId}`,
        );
        setReplies(response.data.replies);
      } catch (error) {
        console.log(error);
      }
    };
    getReplies();
  }, [targetType, targetId]);

  return (
    <Stack sx={{ width: '100%' }}>
      {!!replies?.length &&
        replies.map((reply) => (
          <ReplyCard key={reply._id} reply={reply} direct />
        ))}
    </Stack>
  );
}
