'use client';

import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import apiService from '@/app/lib/apiService';
import { User } from '@/app/lib/definitions';
import socket from '@/app/lib/socket';

export default function UserProfile({ user }: { user: User }) {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    user?.relationship === 'followedByCurrentUser' ||
      user?.relationship === 'followEachOther',
  );

  const createdDate = new Date(user?.createdAt);
  const transformedDate = createdDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

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
    <Stack sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          height: '200px',
          backgroundColor: user?.header ? '' : 'rgb(207, 217, 222)',
        }}
      >
        {user?.header && (
          <Image
            src={user.header}
            alt={user.username}
            width={600}
            height={200}
            style={{ width: '100%', height: 200 }}
          />
        )}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            transform: 'translateY(-50%)',
            left: 15,
          }}
        >
          <Avatar
            sx={{ width: 140, height: 140, border: '4px solid white' }}
            src={user?.avatar}
            alt={user?.username}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          {user?._id === data?.currentUser._id ? (
            <Button
              onClick={() => router.push('/settings/profile')}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 9999,
                border: '1px solid rgb(207, 217, 222)',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(15,20,25,0.1)',
                },
              }}
            >
              Set up profile
            </Button>
          ) : (
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
          )}
        </Box>
      </Box>
      <Stack sx={{ p: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 'bold' }}>
            {user?.displayName}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: 'rgb(83, 100, 113)', fontSize: '15px' }}>
            @{user?.username}
          </Typography>
        </Box>
        {!!user?.bio && (
          <Box sx={{ mt: 1.5 }}>
            <Typography>{user?.bio}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', my: 1 }}>
          {!!user?.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
              <MapPinIcon className="h-5 w-5" />
              <Typography
                sx={{ color: 'rgb(83, 100, 113)', fontSize: '15px', ml: 1 }}
              >
                {user?.location}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarDaysIcon className="h-5 w-5" />
            <Typography
              sx={{ color: 'rgb(83, 100, 113)', fontSize: '15px', ml: 1 }}
            >
              Joined {transformedDate}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
              }}
              onClick={() => router.push(`${pathname}/following`)}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {user?.followingCount}{' '}
                <Typography
                  component="span"
                  sx={{ color: 'rgb(83, 100, 113)', fontSize: '14px' }}
                >
                  Following
                </Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
              }}
              onClick={() => router.push(`${pathname}/followers`)}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', ml: 2 }}>
                {user?.followerCount}{' '}
                <Typography
                  component="span"
                  sx={{ color: 'rgb(83, 100, 113)', fontSize: '14px' }}
                >
                  Followers
                </Typography>{' '}
              </Typography>
            </Box>
          </Box>
          <Box></Box>
        </Box>
      </Stack>
    </Stack>
  );
}
