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

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  {
    name: 'Explore',
    href: '/explore',
    icon: MagnifyingGlassCircleIcon,
  },
  { name: 'Notifications', href: '/notifications', icon: BellAlertIcon },
  { name: 'Messages', href: '/messages', icon: EnvelopeIcon },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
  { name: 'Profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if (link.name === 'Profile')
          link.href = `/${data?.currentUser?.username}`;
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
              <LinkIcon className="w-6" />
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
