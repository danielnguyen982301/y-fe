'use client';

import apiService from '@/app/lib/apiService';
import { useNotif } from '@/app/lib/hooks';
import socket from '@/app/lib/socket';
import ChatPanel from '@/app/ui/chat/chat-panel';
import ChatUserCard from '@/app/ui/chat/chat-user-card';
import NotificationList from '@/app/ui/notification/notification-list';
import SearchBar from '@/app/ui/search-bar';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';

export default function Page() {
  const { data } = useSession();
  const {
    notifs,
    setNotifs,
    setUnreadNotifCount,
    isNotifMounted,
    setIsNotifMounted,
  } = useNotif();
  const [currentTab, setCurrentTab] = useState('All');
  const mentionNotifs = notifs.filter(({ event }) => event === 'mention');

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
    const unreadNotifs = notifs
      .filter(({ isRead }) => !isRead)
      .map(({ _id }) => _id);
    if (!unreadNotifs.length) return;
    setUnreadNotifCount(0);
    const updateNotifStatus = async () => {
      try {
        await apiService.put('/notifications/status', { notifs: unreadNotifs });
        // setNotifs(notifs.map((notif) => ({ ...notif, isRead: true })));
      } catch (error) {
        console.log(error);
      }
    };
    updateNotifStatus();

    // return () => {
    //   setNotifs(notifs.map((notif) => ({ ...notif, isRead: true })));
    // };
  }, [notifs, setNotifs, setUnreadNotifCount]);

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
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box>
          <Box>Notifications</Box>
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
