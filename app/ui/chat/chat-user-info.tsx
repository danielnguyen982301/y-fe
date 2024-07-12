import { ChatUser } from '@/app/lib/definitions';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React from 'react';

export default function ChatUserInfo({ user }: { user: ChatUser }) {
  const createdDate = new Date(user?.createdAt);
  const transformedDate = createdDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgb(239, 243, 244)',
        m: 2,
      }}
    >
      <Box>
        <Avatar
          src={user.avatar}
          alt="user-avatar"
          sx={{ width: 65, height: 65 }}
        />
      </Box>
      <Box sx={{ fontWeight: 'bold' }}>{user.displayName}</Box>
      <Box sx={{ color: 'rgb(83, 100, 113)', fontSize: '15px' }}>
        @{user.username}
      </Box>
      <Box>
        <Typography
          sx={{ color: 'rgb(83, 100, 113)', fontSize: '15px' }}
          component="span"
        >
          Joined {transformedDate}
        </Typography>
        <Typography
          component="span"
          sx={{
            color: 'rgb(83, 100, 113)',
            fontSize: 15,
            '&::before': {
              content: `"•"`,
              mx: 1,
            },
          }}
        >
          {user.followerCount}{' '}
          {user.followerCount <= 1 ? 'Follower' : 'Followers'}
        </Typography>
      </Box>
    </Stack>
  );
}
