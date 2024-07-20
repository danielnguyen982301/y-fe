'use client';

import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import apiService from '@/app/lib/apiService';
import { User } from '@/app/lib/definitions';
import socket from '@/app/lib/socket';

export default function UserCard({ user }: { user: User }) {
  const { data } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    user?.relationship === 'followedByCurrentUser' ||
      user?.relationship === 'followEachOther',
  );
  const isFollowing = user?.relationship === 'followsCurrentUser';
  const isCurrentUser = user?._id === data?.currentUser._id;

  const handleToggleFollow = async (userId: string) => {
    try {
      const response = isFollowed
        ? await apiService.delete('/follows', { data: { followeeId: userId } })
        : await apiService.post('/follows', { followeeId: userId });
      socket.emit(
        'toggleFollowNotif',
        isFollowed
          ? { ...response.data.notif, delete: true }
          : response.data.notif,
      );
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', p: 2, width: '100%' }}>
      <Box sx={{ mr: 1 }}>
        <Avatar src={user?.avatar} alt={user?.username} />
      </Box>
      <Stack sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack>
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>
                {user?.displayName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  color: 'rgb(83, 100, 113)',
                  maxWidth: { xs: isFollowing ? '100px' : '100%', md: 'none' },
                  overflowX: 'hidden',
                }}
              >
                @{user?.username}
              </Box>
              {isFollowing && (
                <Box
                  sx={{
                    ml: 0.5,
                    fontSize: 11,
                    color: 'rgb(83, 100, 113)',
                    bgcolor: 'rgb(239, 243, 244)',
                  }}
                >
                  Follows you
                </Box>
              )}
            </Box>
          </Stack>
          {!isCurrentUser && (
            <Box>
              <Button
                disableElevation
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  width: '100px',
                  border: '1px solid',
                  borderRadius: 9999,
                  borderColor: !isFollowed
                    ? 'white'
                    : isHovered
                    ? 'rgb(253,201,206)'
                    : 'rgb(207, 217, 222)',
                  color: !isFollowed
                    ? 'white'
                    : isHovered
                    ? 'rgb(244,33,46)'
                    : 'rgb(15, 20, 25)',
                  bgcolor: !isFollowed
                    ? 'rgb(15, 20, 25)'
                    : isHovered
                    ? 'rgba(244,33,46,0.1)'
                    : 'white',
                  '&:hover': {
                    bgcolor: !isFollowed
                      ? 'rgb(39,44,48)'
                      : 'rgba(244,33,46,0.1)',
                  },
                }}
                variant="contained"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleToggleFollow(user._id)}
              >
                {!isFollowed ? 'Follow' : isHovered ? 'Unfollow' : 'Following'}
              </Button>
            </Box>
          )}
        </Box>
        <Box>
          <Typography>{user?.bio}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
