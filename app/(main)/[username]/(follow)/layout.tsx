'use client';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useState } from 'react';

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
          value={tab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          // onChange={(e, value) => setCurrentTab(value)}
        >
          {TABS.map((tab) => (
            // <Link key={tab.name} href={`${segments.join('/')}/${tab.name}`}>
            <Tab
              disableRipple
              key={tab.name}
              value={tab.name}
              label={tab.name}
              sx={{ width: '50%' }}
              onClick={() =>
                router.push(`${segments.join('/')}/${tab.name.toLowerCase()}`)
              }
            />
            // </Link>
          ))}
        </Tabs>
        {children}
      </Stack>
    </Box>
  );
}
