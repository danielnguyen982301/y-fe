import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Box, Button, Stack } from '@mui/material';

import NavLinks from './nav-links';
import Logo from '../logo';

export default function SideNav() {
  return (
    <Stack sx={{ alignItems: { sm: 'center', lg: 'flex-start' } }}>
      <Link
        className="mb-2 flex items-end justify-start rounded-md"
        href="/main/home"
      >
        <Logo
          sx={{
            display: 'flex',
            justifyContent: ' center',
            alignItems: 'center',
            height: 40,
            width: 40,
            '&:hover': {
              bgcolor: 'rgba(15,20,25,0.1)',
              borderRadius: 9999,
              cursor: 'pointer',
            },
          }}
        />
      </Link>
      <Box className="flex flex-col space-x-0 space-y-2">
        <NavLinks />
      </Box>
      <Box sx={{ mt: 2, width: '100%' }}>
        <Link href="/compose/post" prefetch={false}>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              display: { xs: 'none', lg: 'block' },
              borderRadius: 9999,
              width: '100%',
              fontWeight: 'bold',
              py: 2,
            }}
          >
            Post
          </Button>
          <Button
            variant="contained"
            sx={{
              display: { md: 'block', lg: 'none' },
              borderRadius: 9999,
              width: '100%',
              minWidth: 0,
              fontWeight: 'bold',
              py: 2,
            }}
          >
            <PencilSquareIcon width={24} />
          </Button>
        </Link>
      </Box>
    </Stack>
  );
}
