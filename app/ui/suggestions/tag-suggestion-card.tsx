import { Hashtag } from '@/app/lib/definitions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Box, Typography } from '@mui/material';
import React from 'react';

export default function TagSuggestionCard({ tag }: { tag: Hashtag }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ width: 25, height: 25, mr: 3 }}>
        <MagnifyingGlassIcon style={{ fontWeight: 'bold' }} />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 'bold' }}>#{tag.name}</Typography>
      </Box>
    </Box>
  );
}
