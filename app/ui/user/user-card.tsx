'use client';

import apiService from '@/app/lib/apiService';
import { Follow, User } from '@/app/lib/definitions';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { Dispatch, SetStateAction, useState } from 'react';

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
      isFollowed
        ? await apiService.delete('/follows', { data: { followeeId: userId } })
        : await apiService.post('/follows', { followeeId: userId });
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', p: 2, width: '100%' }}>
      <Box sx={{ mr: 2 }}>
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
            <Box>
              <Typography sx={{ color: 'rgb(83, 100, 113)' }}>
                @{user?.username}
                {isFollowing && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 0.5,
                      fontSize: 11,
                      color: 'rgb(83, 100, 113)',
                      bgcolor: 'rgb(239, 243, 244)',
                    }}
                  >
                    Follows you
                  </Typography>
                )}
              </Typography>
            </Box>
          </Stack>
          {!isCurrentUser && (
            <Box>
              <Button
                sx={{ width: '100px' }}
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
