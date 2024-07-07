'use client';

import apiService from '@/app/lib/apiService';
import { User } from '@/app/lib/definitions';
import { useUserData } from '@/app/lib/hooks';
import LikeList from '@/app/ui/like/like-list';
import PostList from '@/app/ui/post/post-list';
import ReplyList from '@/app/ui/reply/reply-list';
import UserProfile from '@/app/ui/user/user-profile';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page({ params }: { params: { username: string } }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('Posts');
  const pathname = usePathname();
  const { username } = params;
  const { data } = useSession();
  const isCurrentUser = data?.currentUser._id === selectedUser?._id;

  const TABS = [
    {
      name: 'Posts',
      component: <PostList user={selectedUser} tab={currentTab} />,
    },
    {
      name: 'Replies',
      component: <ReplyList user={selectedUser as User} />,
    },
    {
      name: 'Likes',
      component: <LikeList user={selectedUser as User} />,
    },
  ];

  useEffect(() => {
    if (!pathname.includes(username)) return;
    const getSingleUser = async () => {
      try {
        const response = await apiService.get(`/users/${username}`);
        setSelectedUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleUser();
  }, [username, pathname]);

  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box>
          <Box></Box>
          <Stack>
            <Box>
              <Typography>{selectedUser?.displayName}</Typography>
            </Box>
            <Box>
              <Typography>{selectedUser?.postCount} posts</Typography>
            </Box>
          </Stack>
        </Box>
        <UserProfile user={selectedUser as User} />
        <Tabs
          sx={{ borderBottom: '1px solid rgb(239, 243, 244)', width: '100%' }}
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => setCurrentTab(value)}
        >
          {TABS.map((tab) => {
            if (tab.name === 'Likes') {
              if (isCurrentUser) {
                return (
                  <Tab
                    disableRipple
                    key={tab.name}
                    value={tab.name}
                    label={tab.name}
                    sx={{ width: 'calc(100% / 3)' }}
                  />
                );
              } else return null;
            }
            return (
              <Tab
                disableRipple
                key={tab.name}
                value={tab.name}
                label={tab.name}
                sx={{ width: isCurrentUser ? 'calc(100% /3)' : '50%' }}
              />
            );
          })}
        </Tabs>
        {TABS.map((tab) => {
          const isMatched = tab.name === currentTab;
          return isMatched && <Stack key={tab.name}>{tab.component}</Stack>;
        })}
      </Stack>
    </Box>
  );
}
