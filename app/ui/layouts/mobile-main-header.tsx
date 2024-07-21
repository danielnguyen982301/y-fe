'use client';

import { Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import NavLinks from './nav-links';
import { logOut } from '@/app/lib/actions';
import { useChat } from '@/app/lib/hooks';

export default function MobileMainHeader({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { selectedChatUser } = useChat();
  const { data } = useSession();
  const isChatting = pathname.includes('messages') && selectedChatUser;
  const showTopHeaderCondition =
    !pathname.includes('posts') &&
    !pathname.includes('replies') &&
    !pathname.includes(data?.currentUser.username as string);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await logOut();
    } catch (error) {}
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
        Log out @{data?.currentUser.username}
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {showTopHeaderCondition && (
        <Box
          sx={{
            display: { xs: isChatting ? 'none' : 'flex', sm: 'none' },
            position: 'sticky',
            top: 0,
            width: '100%',
            p: 1,
            borderBottom: '1px solid rgb(239, 243, 244)',
            bgcolor: 'white',
            zIndex: 1,
          }}
        >
          <Box onClick={handleAccountMenuOpen}>
            <Avatar
              src={data?.currentUser.avatar}
              alt="user-avatar"
              sx={{ width: 32, height: 32 }}
            />
          </Box>
        </Box>
      )}
      {children}

      {!pathname.includes('messages') && (
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            position: 'fixed',
            bottom: '80px',
            right: '20px',
          }}
        >
          <Link href="/compose/post" prefetch={false}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 9999,
                width: '100%',
                minWidth: 0,
                fontWeight: 'bold',
                p: 2,
              }}
            >
              <PencilSquareIcon width={24} height={24} />
            </Button>
          </Link>
        </Box>
      )}
      <Box
        sx={{
          display: { xs: isChatting ? 'none' : 'flex', sm: 'none' },
          justifyContent: 'space-between',
          position: 'fixed',
          bottom: 0,
          width: '100%',
          p: 1,
          bgcolor: 'white',
          borderTop: '1px solid rgb(239, 243, 244)',
        }}
      >
        <NavLinks />
      </Box>
      {renderMenu}
    </>
  );
}
