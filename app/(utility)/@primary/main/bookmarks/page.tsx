'use client';

import BookmarkList from '@/app/ui/bookmark/bookmark-list';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const { data } = useSession();
  return (
    <Box sx={{ display: 'flex', width: '1050px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box>
          <Stack>
            <Box>
              <Typography>Bookmarks</Typography>
            </Box>
            <Box>
              <Typography>@{data?.currentUser.username}</Typography>
            </Box>
          </Stack>
        </Box>
        <BookmarkList />
      </Stack>
    </Box>
  );
}
