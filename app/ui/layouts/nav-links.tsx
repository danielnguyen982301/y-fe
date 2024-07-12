'use client';

import {
  HomeIcon,
  MagnifyingGlassCircleIcon,
  BellAlertIcon,
  EnvelopeIcon,
  BookmarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Box, Typography } from '@mui/material';
import { useUserData } from '@/app/lib/hooks';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import socket from '@/app/lib/socket';
import { ChatUser } from '@/app/lib/definitions';
import apiService from '@/app/lib/apiService';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/main/home', icon: HomeIcon },
  {
    name: 'Explore',
    href: '/main/explore',
    icon: MagnifyingGlassCircleIcon,
  },
  { name: 'Notifications', href: '/main/notifications', icon: BellAlertIcon },
  { name: 'Messages', href: '/main/messages', icon: EnvelopeIcon },
  { name: 'Bookmarks', href: '/main/bookmarks', icon: BookmarkIcon },
  { name: 'Profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data } = useSession();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [newMessages, setNewMessages] = useState(0);
  const isOnChatRoute = pathname.includes('messages');

  useEffect(() => {
    if (isOnChatRoute) return;
    const getChatUsers = async () => {
      try {
        const response = await apiService.get('/messages/users');
        setChatUsers(response.data.chatUsers);
        setNewMessages(
          (response.data.chatUsers as ChatUser[]).filter((user) =>
            user.messages.some(({ isRead }) => !isRead),
          ).length,
        );
      } catch (error) {
        console.log(error);
      }
    };
    getChatUsers();
  }, [isOnChatRoute]);

  useEffect(() => {
    socket.on('privateMessage', (message) => {
      if (!isOnChatRoute) {
        const newChatList = chatUsers.map((user) => {
          const fromSelf = data?.currentUser._id === message.from;
          if (user._id === (fromSelf ? message.to : message.from)) {
            return {
              ...user,
              messages: [...user.messages, message],
            };
          }
          return user;
        });
        setChatUsers(newChatList);
        setNewMessages(
          newChatList.filter((user) =>
            user.messages.some(({ isRead }) => !isRead),
          ).length,
        );
      }
    });

    socket.on('newMessages', (newMessages) => {
      setNewMessages(newMessages);
    });

    return () => {
      socket.off('privateMessage');
      socket.off('newMessages');
    };
  }, [chatUsers, data, isOnChatRoute]);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if (link.name === 'Profile')
          link.href = `/main/${data?.currentUser?.username}`;
        return (
          <Box key={link.name} sx={{ py: 1 }}>
            <Link
              href={link.href as string}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-5 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
              )}
            >
              <Box sx={{ position: 'relative' }}>
                {link.name === 'Messages' && !!newMessages && (
                  <Box
                    sx={{
                      bgcolor: 'red',
                      color: 'white',
                      position: 'absolute',
                      top: -10,
                      right: -8,
                      px: 0.5,
                    }}
                  >
                    {newMessages}
                  </Box>
                )}
                <LinkIcon className="w-6" />
              </Box>
              <Typography className="hidden md:block" sx={{ fontSize: '20px' }}>
                {link.name}
              </Typography>
            </Link>
          </Box>
        );
      })}
    </>
  );
}
