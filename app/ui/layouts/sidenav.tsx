import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { Box, Button, Stack } from '@mui/material';
import NavLinks from './nav-links';

export default function SideNav() {
  return (
    <Stack sx={{ alignItems: 'flex-start', mt: 2 }}>
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4"
        href="/home"
      >
        <Box className="w-32 text-white md:w-40">
          <AcmeLogo />
        </Box>
      </Link>
      <Box className="flex flex-col space-x-0 space-y-2">
        <NavLinks />
      </Box>
      <Box>
        <Button variant="contained" sx={{ mt: 2 }}>
          Post
        </Button>
      </Box>
    </Stack>
  );
}
