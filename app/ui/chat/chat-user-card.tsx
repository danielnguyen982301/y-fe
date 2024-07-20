'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, Box, Stack, Typography } from '@mui/material';

import { ChatUser } from '@/app/lib/definitions';
import { transformedDateAndTime } from '@/app/lib/utils';

export default function ChatUserCard({
  user,
  handleSelectChatUser,
  isSelected,
}: {
  user: ChatUser;
  handleSelectChatUser: (user: ChatUser) => void;
  isSelected: boolean;
}) {
  const { data } = useSession();
  const router = useRouter();
  const unreadMessagesNumber = user.messages.filter(
    ({ isRead, from }) => !isRead && from !== data?.currentUser._id,
  ).length;

  return (
    <>
      <Stack
        onClick={() => handleSelectChatUser(user)}
        sx={{
          width: '100%',
          bgcolor: isSelected ? 'rgba(235,235,235,0.9)' : '',
          borderRight: isSelected ? '2px solid rgb(29, 155, 240)' : '',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            px: 2,
            py: 1,
          }}
        >
          <Stack sx={{ alignItems: 'center' }}>
            <Avatar src={user.avatar} alt={'user-avatar'} />
          </Stack>
          <Stack sx={{ flexGrow: 1, pl: 1 }}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/main/${user.username}`);
                  }}
                  component="span"
                  sx={{
                    mr: 0.5,
                    display: 'inline-block',
                    maxWidth: { xs: '100px', sm: '150px' },
                    overflowX: 'hidden',
                    whiteSpace: 'nowrap',
                    color: 'rgb(15, 20, 25)',
                    fontWeight: 'bold',
                    fontSize: 15,
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {user.displayName}
                </Typography>
                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/main/${user.username}`);
                  }}
                  component="span"
                  sx={{
                    display: 'inline-block',
                    maxWidth: { xs: '100px', sm: '150px' },
                    overflowX: 'hidden',
                    color: 'rgb(83, 100, 113)',
                    fontSize: 15,
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  @{user.username}
                </Typography>
                {!!user.messages.length && (
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
                    {transformedDateAndTime(
                      user.messages.slice(-1)[0].createdAt,
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
            {!!user.messages.length && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>{user.messages.slice(-1)[0].content}</Box>
                {!!unreadMessagesNumber && (
                  <Box
                    sx={{
                      bgcolor: 'red',
                      color: 'white',
                      px: 0.5,
                      fontWeight: 'bold',
                    }}
                  >
                    {unreadMessagesNumber}
                  </Box>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
