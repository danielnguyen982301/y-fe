import { Follow, User } from '@/app/lib/definitions';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React from 'react';

export default function UserSuggestionCard({ user }: { user: User }) {
  const relationship = user.relationship;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ mr: 2 }}>
        <Avatar src={user.avatar} alt={user.username} />
      </Box>
      <Stack>
        <Box>
          <Typography sx={{ fontWeight: 'bold' }}>
            {user.displayName}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: 'rgb(83, 100, 113)' }}>
            @{user.username}
          </Typography>
        </Box>
        {relationship && (
          <Box>
            <Typography>
              {relationship === 'followEachOther'
                ? 'You follow each other'
                : relationship === 'followsCurrentUser'
                ? 'Follows you'
                : 'Following'}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
