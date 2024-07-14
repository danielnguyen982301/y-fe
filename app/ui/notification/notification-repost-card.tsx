import { Post, Reply, User } from '@/app/lib/definitions';
import {
  ArrowPathRoundedSquareIcon,
  UserIcon,
} from '@heroicons/react/20/solid';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function NotificationRepostCard({
  sender,
  repost,
  repostType,
}: {
  sender: User;
  repost: Post | Reply;
  repostType: 'Post' | 'Reply';
}) {
  const router = useRouter();
  return (
    <Box
      onClick={() =>
        router.push(
          `/main/${repost.author.username}/${
            repostType === 'Post' ? 'posts' : 'replies'
          }/${repost._id}`,
        )
      }
      sx={{
        width: '100%',
        display: 'flex',
        px: 2,
        py: 1,
        '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' },
      }}
    >
      <Box>
        <ArrowPathRoundedSquareIcon width={20} height={20} />
      </Box>
      <Stack>
        <Box>
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={sender.avatar}
            alt="sender-avatar"
          />
        </Box>
        <Box>
          <Typography>{sender.displayName}</Typography> reposted your{' '}
          {repostType === 'Post' ? 'post' : 'reply'}
        </Box>
        <Box>{repost.content}</Box>
      </Stack>
    </Box>
  );
}
