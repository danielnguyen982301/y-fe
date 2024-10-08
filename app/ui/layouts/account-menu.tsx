import { Avatar, Box, Stack, Typography } from '@mui/material';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import { User } from '@/app/lib/definitions';

export default function AccountMenu({
  user,
  handleClick,
}: {
  user: User;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Box
      onClick={handleClick}
      sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
    >
      <Box>
        <Avatar src={user?.avatar} alt={user?.username} />
      </Box>
      <Stack sx={{ px: 2, display: { xs: 'none', lg: 'flex' } }}>
        <Typography sx={{ fontWeight: 'bold' }}>{user?.displayName}</Typography>
        <Typography sx={{ color: 'rgb(83, 100, 113)' }}>
          @{user?.username}
        </Typography>
      </Stack>
      <Box
        sx={{
          width: '30px',
          height: '30px',
          mr: 2,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <EllipsisHorizontalIcon />
      </Box>
    </Box>
  );
}
