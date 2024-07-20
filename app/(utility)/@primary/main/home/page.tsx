'use client';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Thread } from '@/app/lib/definitions';
import PostForm from '@/app/ui/post/post-form';
import PostList from '@/app/ui/post/post-list';
import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';

export default function Page() {
  const { data } = useSession();
  const defaultTab = data?.currentUser.followingCount ? 'Following' : 'For You';
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [newPost, setNewPost] = useState<Thread | null>(null);

  const TABS = [
    {
      name: 'For You',
      component: (
        <>
          <PostList newPost={newPost} />
          <PostList tab={currentTab} />{' '}
        </>
      ),
    },
    {
      name: 'Following',
      component: <PostList tab={currentTab} newPost={newPost} />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          width: { xs: '100%', sm: '500px', lg: '600px' },
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Tabs
          sx={{ borderBottom: '1px solid rgb(239, 243, 244)', width: '100%' }}
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => setCurrentTab(value)}
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.name}
              value={tab.name}
              label={tab.name}
              sx={{ width: '50%', textTransform: 'none', fontWeight: 'bold' }}
            />
          ))}
        </Tabs>
        <Stack sx={{ width: '100%' }}>
          <PostForm setNewPost={setNewPost} />
          {TABS.map((tab) => {
            const isMatched = tab.name === currentTab;
            return isMatched && <Stack key={tab.name}>{tab.component}</Stack>;
          })}
        </Stack>
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
