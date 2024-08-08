import { CardsSkeleton } from '@/app/ui/skeletons';
import { Box, Stack } from '@mui/material';

export default function Default() {
  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          height: '100vh',
          justifyContent: 'space-between',
          width: { xs: '100%', sm: '500px', lg: '600px' },
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <CardsSkeleton />
      </Stack>
    </Box>
  );
}
