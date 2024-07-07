import { CardsSkeleton } from '@/app/ui/skeletons';
import { Box, Stack } from '@mui/material';

export default function Default() {
  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          height: '100vh',
          justifyContent: 'space-between',
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <CardsSkeleton />
      </Stack>
    </Box>
  );
}
