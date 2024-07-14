'use client';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { Stack } from '@mui/material';
import { logOut } from '@/app/lib/actions';
import SideNav from './sidenav';
import AccountMenu from './account-menu';
import { useSession } from 'next-auth/react';
import { User } from '@/app/lib/definitions';
import socket from '@/app/lib/socket';

export default function MainHeader() {
  const { data } = useSession();
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
    } catch (error) {
      console.error(error);
    }
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

  React.useEffect(() => {
    if (!data) return;
    // const sessionId = localStorage.getItem('sessionId');

    // if (sessionId) {
    //   socket.auth = { sessionId };
    //   socket.connect();
    // } else {
    //   socket.auth = {
    //     username: data?.currentUser.username,
    //     userId: data?.currentUser._id,
    //   };
    //   socket.connect();
    // }
    socket.auth = { userId: data?.currentUser._id };
    socket.connect();

    // socket.on(
    //   'session',
    //   ({ sessionId, userId }: { sessionId: string; userId: string }) => {
    //     // attach the session ID to the next reconnection attempts
    //     socket.auth = { sessionId };
    //     // store it in the localStorage
    //     localStorage.setItem('sessionId', sessionId);
    //     // save the ID of the user
    //     socket.userId = userId;
    //   },
    // );

    // socket.on("connect_error", (err) => {
    //   if (err.message === "invalid user") {

    //   }
    // });
    return () => {
      socket.off('connect_error');
    };
  }, [data]);

  return (
    <Stack
      sx={{
        borderRight: '1px solid rgb(239, 243, 244)',
        height: '100vh',
        width: '25vw',
        alignItems: 'flex-end',
        position: 'sticky',
        top: 0,
      }}
    >
      <Stack
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <SideNav />
        <AccountMenu
          user={data?.currentUser as User}
          handleClick={handleAccountMenuOpen}
        />
      </Stack>
      {renderMenu}
    </Stack>
  );
}
