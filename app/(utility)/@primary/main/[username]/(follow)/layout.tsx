'use client';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';

import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/');
  let tab = segments.pop() as string;
  tab = tab?.charAt(0).toUpperCase() + tab?.substring(1);

  const TABS = [
    {
      name: 'Followers',
    },
    {
      name: 'Following',
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
        <Box
          onClick={() => router.back()}
          sx={{ px: 1, pt: 1, cursor: 'pointer' }}
        >
          <ArrowLeftIcon width={20} height={20} />
        </Box>
        <Tabs
          sx={{ borderBottom: '1px solid rgb(239, 243, 244)', width: '100%' }}
          value={tab}
          scrollButtons={false}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.name}
              value={tab.name}
              label={tab.name}
              sx={{ width: '50%', textTransform: 'none', fontWeight: 'bold' }}
              onClick={() =>
                router.push(`${segments.join('/')}/${tab.name.toLowerCase()}`)
              }
            />
          ))}
        </Tabs>
        {children}
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
