'use client';

import { ChatUser } from '@/app/lib/definitions';
import { Box, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

export default function ChatPanel({
  user,
  onMessage,
}: {
  user: ChatUser;
  onMessage: (input: string) => void;
}) {
  const [messageInput, setMessageInput] = useState('');
  return (
    <Stack>
      <Stack>
        {!!user.messages.length &&
          user.messages.map((message) => (
            <Box key={message.content}>
              <Typography>
                {message.fromSelf ? 'You' : user.username}
              </Typography>
              <Typography>{message.content}</Typography>
            </Box>
          ))}
      </Stack>
      <Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onMessage(messageInput);
          }}
        >
          <TextField
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </form>
      </Box>
    </Stack>
  );
}
