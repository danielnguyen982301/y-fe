import { Stack } from '@mui/material';

import Logo from '../ui/logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Stack minHeight="100vh" justifyContent="center" alignItems="center">
      <Logo
        sx={{
          mb: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />

      {children}
    </Stack>
  );
}
