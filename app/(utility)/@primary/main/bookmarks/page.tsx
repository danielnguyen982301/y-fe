'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import BookmarkList from '@/app/ui/bookmark/bookmark-list';
import SearchBar from '@/app/ui/search-bar';
import TrendingTagList from '@/app/ui/side-search/trending-tag-list';

export default function Page() {
  const { data } = useSession();
  return (
    <Box sx={{ display: 'flex', width: { xs: '100%', sm: '1050px' } }}>
      <Stack
        sx={{
          width: { xs: '100%', sm: '500px', lg: '600px' },
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box>
          <Stack>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 17, sm: 20 },
                  fontWeight: 'bold',
                  px: 1,
                  pt: 1,
                }}
              >
                Bookmarks
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 13, color: 'rgb(83, 100, 113)', px: 1 }}
              >
                @{data?.currentUser.username}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <BookmarkList />
      </Stack>
      <Stack
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '300px',
          height: '100vh',
          ml: { lg: '20px', md: '10px' },
          position: 'sticky',
          top: 0,
        }}
        spacing={4}
      >
        <SearchBar query="" />
        <TrendingTagList />
      </Stack>
    </Box>
  );
}
