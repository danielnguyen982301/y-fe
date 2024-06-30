import { User } from '@/app/lib/definitions';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function UserProfile({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const createdDate = new Date(user?.createdAt);
  const transformedDate = createdDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
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
          <Button
            variant="outlined"
            sx={{
              borderRadius: 9999,
              borderColor: 'lightgray',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Set up profile
          </Button>
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
          <Box>
            <Typography>{user?.bio}</Typography>
          </Box>
        )}
        <Box>
          {!!user?.location && (
            <Box>
              <MapPinIcon className="h-5 w-5" />
              <Typography>{user?.location}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
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
