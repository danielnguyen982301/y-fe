'use client';

import { Post, Thread } from '@/app/lib/definitions';
import { useUserData } from '@/app/lib/hooks';
import socket from '@/app/lib/socket';
import PostFormModal from '@/app/ui/modal/post-form-modal';
import PostForm from '@/app/ui/post/post-form';
import PostList from '@/app/ui/post/post-list';
import SearchBar from '@/app/ui/search-bar';
import { Box, Container, Stack, Tab, Tabs } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
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
              sx={{ width: '50%' }}
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
      <Box sx={{ width: '350px', ml: '30px' }}>
        <SearchBar query="" />
      </Box>
    </Box>
  );
}
