'use client';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import PostList from '@/app/ui/post/post-list';
import SearchBar from '@/app/ui/search-bar';
import UserList from '@/app/ui/user/user-list';

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
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          width: { xs: '100%', sm: '500px', lg: '600px' },
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
              sx={{ width: '50%', textTransform: 'none', fontWeight: 'bold' }}
            />
          ))}
        </Tabs>
        {TABS.map((tab) => {
          const isMatched = tab.name === currentTab;
          return isMatched && <Stack key={tab.name}>{tab.component}</Stack>;
        })}
      </Stack>
      <Stack
        sx={{
          display: { xs: 'none', sm: 'flex' },
          width: '300px',
          height: '100vh',
          ml: '30px',
          position: 'sticky',
          top: 0,
        }}
        spacing={4}
      >
        <Box sx={{ width: '100%' }} />
      </Stack>
    </Box>
  );
}
