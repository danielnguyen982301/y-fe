'use client';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { useNotif } from '@/app/lib/hooks';
import NotificationList from '@/app/ui/notification/notification-list';
import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';

export default function Page() {
  const {
    notifs,
    setNotifs,
    setUnreadNotifCount,
    isNotifMounted,
    setIsNotifMounted,
  } = useNotif();
  const [currentTab, setCurrentTab] = useState('All');
  const mentionNotifs = notifs.filter(({ event }) => event === 'mention');
  const unreadNotifs = notifs
    .filter(({ isRead }) => !isRead)
    .map(({ _id }) => _id);

  const TABS = [
    {
      name: 'All',
      component: <NotificationList notifs={notifs} />,
    },
    {
      name: 'Mentions',
      component: <NotificationList notifs={mentionNotifs} />,
    },
  ];

  useEffect(() => {
    setIsNotifMounted(true);
  }, [setIsNotifMounted]);

  useEffect(() => {
    if (!unreadNotifs.length) return;
    setUnreadNotifCount(0);
    const updateNotifStatus = async () => {
      try {
        await apiService.put('/notifications/status', { notifs: unreadNotifs });
      } catch (error) {
        console.log(error);
      }
    };
    updateNotifStatus();
  }, [unreadNotifs, setNotifs, setUnreadNotifCount]);

  useEffect(() => {
    return () => {
      if (isNotifMounted) {
        setNotifs((prevState) =>
          prevState.map((notif) => ({ ...notif, isRead: true })),
        );
        setIsNotifMounted(false);
      }
    };
  }, [setNotifs, isNotifMounted, setIsNotifMounted]);

  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          width: { xs: '100%', sm: '500px', lg: '600px' },
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box>
          <Box sx={{ fontSize: { xs: 17, sm: 20 }, fontWeight: 'bold', p: 1 }}>
            Notifications
          </Box>
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
