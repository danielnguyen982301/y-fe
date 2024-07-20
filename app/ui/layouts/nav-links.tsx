'use client';

import {
  HomeIcon,
  BellAlertIcon,
  EnvelopeIcon,
  BookmarkIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import { useChat, useNotif } from '@/app/lib/hooks';

const links = [
  { name: 'Home', href: '/main/home', icon: HomeIcon },
  {
    name: 'Explore',
    href: '/main/explore',
    icon: MagnifyingGlassIcon,
  },
  { name: 'Notifications', href: '/main/notifications', icon: BellAlertIcon },
  { name: 'Messages', href: '/main/messages', icon: EnvelopeIcon },
  { name: 'Bookmarks', href: '/main/bookmarks', icon: BookmarkIcon },
  { name: 'Profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data } = useSession();
  const { newMessages } = useChat();
  const { unreadNotifCount } = useNotif();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if (link.name === 'Profile')
          link.href = `/main/${data?.currentUser?.username}`;
        return (
          <Box key={link.name}>
            <Link
              href={link.href as string}
              className={clsx(
                'flex h-[48px] grow items-center gap-5 rounded-full p-3 text-sm font-medium hover:bg-slate-200',
                {
                  'bg-slate-200': pathname === link.href,
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
                {link.name === 'Notifications' && !!unreadNotifCount && (
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
                    {unreadNotifCount}
                  </Box>
                )}
                <LinkIcon className="w-6" />
              </Box>
              <Typography
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  fontSize: '20px',
                  fontWeight: pathname === link.href ? 'bold' : 'none',
                }}
              >
                {link.name}
              </Typography>
            </Link>
          </Box>
        );
      })}
    </>
  );
}
