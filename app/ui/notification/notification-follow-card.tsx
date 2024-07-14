import { User } from '@/app/lib/definitions';
import { UserIcon } from '@heroicons/react/20/solid';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function NotificationFollowCard({ sender }: { sender: User }) {
  const router = useRouter();
  return (
    <Box
      onClick={() => router.push(`/main/${sender.username}`)}
      sx={{
        width: '100%',
        display: 'flex',
        px: 2,
        py: 1,
        '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' },
      }}
    >
      <Box>
        <UserIcon width={20} height={20} />
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
          <Typography>{sender.displayName}</Typography> followed you
        </Box>
      </Stack>
    </Box>
  );
}
