'use client';

import { Box, Card, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { Hashtag } from '@/app/lib/definitions';
import LoadingScreen from '../loading-screen';

export default function TrendingTagList() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);

  useEffect(() => {
    const getHashtags = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/hashtags');
        setHashtags(response.data.hashtags);
        setLoading(false);
      } catch (error) {}
    };
    getHashtags();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      {!!hashtags.length && (
        <Card>
          <Stack>
            <Box sx={{ fontSize: 20, fontWeight: 'bold', p: 1.5 }}>
              Trends for You
            </Box>
            <Stack
              spacing={2}
              sx={{
                height: '50vh',
                overflowY: 'auto',
                '::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {hashtags.map((tag) => (
                <Stack
                  onClick={() =>
                    router.push(
                      `/main/explore?q=${encodeURIComponent(`#${tag.name}`)}`,
                    )
                  }
                  sx={{
                    p: 1.5,
                    '&:hover': {
                      cursor: 'pointer',
                      bgcolor: 'rgba(0,0,0,0.03)',
                    },
                  }}
                  key={tag._id}
                >
                  <Box sx={{ fontWeight: 'bold' }}>#{tag.name}</Box>
                  <Box sx={{ fontSize: 13, color: 'rgb(83, 100, 113)' }}>
                    {tag.postCount} {tag.postCount > 1 ? 'posts' : 'post'}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  );
}
