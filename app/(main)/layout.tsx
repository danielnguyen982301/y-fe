import { Box, Container, Stack } from '@mui/material';
import MainHeader from '../ui/layouts/main-header';
import MainFooter from '../ui/layouts/main-footer';
import { auth, signOut } from '@/auth';
import { isValidToken } from '../lib/utils';
import { getSession, logOut } from '../lib/actions';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth={false} sx={{ display: 'flex' }}>
      <MainHeader />

      {children}
    </Container>
  );
}
