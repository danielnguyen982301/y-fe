'use client';

import PostList from '@/app/ui/post/post-list';
import SearchBar from '@/app/ui/search-bar';
import UserList from '@/app/ui/user/user-list';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [currentTab, setCurrentTab] = useState('People');
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const TABS = [
    {
      name: 'People',
      component: <UserList query={query} tab={currentTab} />,
    },
    {
      name: 'Searched Posts',
      component: <PostList tab={currentTab} query={query} />,
    },
  ];

  useEffect(() => {
    if (query?.startsWith('#')) {
      setCurrentTab('Searched Posts');
    } else {
      setCurrentTab('People');
    }
  }, [query]);

  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <SearchBar query={query} />
        </Box>
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
        {TABS.map((tab) => {
          const isMatched = tab.name === currentTab;
          return isMatched && <Stack key={tab.name}>{tab.component}</Stack>;
        })}
      </Stack>
    </Box>
  );
}
