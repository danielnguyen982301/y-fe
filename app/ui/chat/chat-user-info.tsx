import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { ChatUser } from '@/app/lib/definitions';

export default function ChatUserInfo({ user }: { user: ChatUser }) {
  const router = useRouter();
  const createdDate = new Date(user?.createdAt);
  const transformedDate = createdDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  return (
    <Stack
      onClick={() => router.push(`/main/${user.username}`)}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgb(239, 243, 244)',
        m: 2,
        p: 2,
        '&:hover': {
          bgcolor: 'rgb(247,249,249)',
          cursor: 'pointer',
        },
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
              mx: 0.5,
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
