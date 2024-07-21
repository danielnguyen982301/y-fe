'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { User } from '@/app/lib/definitions';
import LikeList from '@/app/ui/like/like-list';
import LoadingScreen from '@/app/ui/loading-screen';
import PostList from '@/app/ui/post/post-list';
import ReplyList from '@/app/ui/reply/reply-list';
import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';
import UserProfile from '@/app/ui/user/user-profile';

export default function Page({ params }: { params: { username: string } }) {
  const pathname = usePathname();
  const { username } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('Posts');
  const isOnProfile = pathname.includes(username);

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
    if (!isOnProfile) return;
    const getSingleUser = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/users/${username}`);
        setSelectedUser(response.data);
        setLoading(false);
      } catch (error) {}
    };
    getSingleUser();
  }, [username, isOnProfile]);

  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          width: { xs: '100%', sm: '500px', lg: '600px' },
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            {selectedUser && (
              <>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', px: 1, pt: 1 }}
                >
                  <Box
                    onClick={() => router.back()}
                    sx={{ mr: 4, cursor: 'pointer' }}
                  >
                    <ArrowLeftIcon width={20} height={20} />
                  </Box>
                  <Stack>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: 17, sm: 20 },
                          fontWeight: 'bold',
                        }}
                      >
                        {selectedUser?.displayName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontSize: 13, color: 'rgb(83, 100, 113)' }}
                      >
                        {selectedUser?.postCount} posts
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <UserProfile user={selectedUser as User} />
                <Tabs
                  sx={{
                    borderBottom: '1px solid rgb(239, 243, 244)',
                    width: '100%',
                  }}
                  value={currentTab}
                  scrollButtons="auto"
                  variant="scrollable"
                  allowScrollButtonsMobile
                  onChange={(e, value) => setCurrentTab(value)}
                >
                  {TABS.map((tab) => {
                    return (
                      <Tab
                        disableRipple
                        key={tab.name}
                        value={tab.name}
                        label={tab.name}
                        sx={{
                          width: 'calc(100% /3)',
                          textTransform: 'none',
                          fontWeight: 'bold',
                        }}
                      />
                    );
                  })}
                </Tabs>
                {TABS.map((tab) => {
                  const isMatched = tab.name === currentTab;
                  return (
                    isMatched && <Stack key={tab.name}>{tab.component}</Stack>
                  );
                })}
              </>
            )}
          </>
        )}
      </Stack>
      <Stack
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '300px',
          height: '100vh',
          ml: { lg: '20px', md: '10px' },
          position: 'sticky',
          top: 0,
        }}
        spacing={4}
      >
        <SearchBar query="" />
        <TrendingTagList />
      </Stack>
    </Box>
  );
}
