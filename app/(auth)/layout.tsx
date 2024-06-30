import { Stack } from '@mui/material';
import Logo from '../ui/logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Stack minHeight="100vh" justifyContent="center" alignItems="center">
      <Logo sx={{ width: 90, height: 90, mb: 5 }} />

      {children}
    </Stack>
  );
}
