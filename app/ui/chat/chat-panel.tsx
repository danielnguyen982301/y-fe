'use client';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

import { ChatUser, Message } from '@/app/lib/definitions';
import ChatUserInfo from './chat-user-info';
import { useChat } from '@/app/lib/hooks';

export default function ChatPanel({
  user,
  onMessage,
}: {
  user: ChatUser;
  onMessage: (input: string) => void;
}) {
  const { setSelectedChatUser } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const { data } = useSession();
  const msgHistoryRef = useRef<HTMLDivElement | null>(null);
  const lastMsgRef = useRef<HTMLDivElement | null>(null);
  const readMessages = user.messages.filter(
    ({ isRead, from }) => isRead || from === data?.currentUser._id,
  );
  const unreadMessages = user.messages.filter(
    ({ isRead, from }) => !isRead && from !== data?.currentUser._id,
  );
  const transformedCreatedTime = (createdDate: string) => {
    const date = new Date(createdDate);
    return date
      .toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
      .replace(' at', ',');
  };

  const generateChatBubbles = (messages: Message[]) =>
    messages.map((message) => {
      const isFromCurrentUser = message.from === data?.currentUser._id;
      return (
        <Stack
          key={message._id}
          sx={
            isFromCurrentUser
              ? { alignSelf: 'flex-end', alignItems: 'flex-end', m: 2 }
              : { alignSelf: 'flex-start', alignItems: 'flex-start', m: 2 }
          }
        >
          <Box
            sx={{
              bgcolor: isFromCurrentUser
                ? 'rgb(29, 155, 240)'
                : 'rgb(239, 243, 244)',
              color: isFromCurrentUser ? 'white' : 'black',
              borderRadius: '24px',
              borderBottomRightRadius: isFromCurrentUser ? '4px' : '',
              borderBottomLeftRadius: isFromCurrentUser ? '' : '4px',
              p: 1.5,
            }}
          >
            <Typography></Typography>
            <Typography>{message.content}</Typography>
          </Box>
          <Box sx={{ fontSize: 13, color: 'rgb(83, 100, 113)' }}>
            {transformedCreatedTime(message.createdAt)}
          </Box>
        </Stack>
      );
    });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onMessage(messageInput);
    setMessageInput('');
  };

  useEffect(() => {
    if (msgHistoryRef.current && lastMsgRef.current) {
      msgHistoryRef.current.scrollTop = lastMsgRef?.current?.offsetTop;
    }
  }, [user.messages]);

  return (
    <Stack sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pt: 1 }}>
        <Box
          onClick={() => setSelectedChatUser(null)}
          sx={{
            display: { xs: 'block', md: 'none' },
            mr: 4,
            cursor: 'pointer',
          }}
        >
          <ArrowLeftIcon width={20} height={20} />
        </Box>
        <Box sx={{ fontSize: 17, fontWeight: 'bold' }}>{user.displayName}</Box>
      </Box>
      <ChatUserInfo user={user} />
      <Stack
        ref={msgHistoryRef}
        id="message-history"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          '::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {!!readMessages.length && generateChatBubbles(readMessages)}
        <Box ref={lastMsgRef} id="last-message"></Box>
        {!!unreadMessages.length && (
          <Box
            id="new-message-notification"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              m: 2,
            }}
          >
            <Box
              sx={{
                height: 0,
                flexGrow: 1,
                border: '1px solid rgb(239, 243, 244)',
              }}
            ></Box>
            <Box sx={{ fontSize: 14, fontWeight: 500 }}>
              {unreadMessages.length} new message
              {unreadMessages.length > 1 ? 's' : ''}
            </Box>
            <Box
              sx={{
                height: 0,
                flexGrow: 1,
                border: '1px solid rgb(239, 243, 244)',
              }}
            ></Box>
          </Box>
        )}
        {!!unreadMessages.length && generateChatBubbles(unreadMessages)}
      </Stack>
      <Box sx={{ py: 1, px: 1.5, borderTop: '1px solid rgb(239, 243, 244)' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            autoComplete="off"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Start a new message"
            sx={{
              width: '100%',
              bgcolor: 'rgb(239, 243, 244)',
              borderRadius: '16px',
              '& fieldset': {
                border: 'none',
              },
            }}
            InputProps={{
              endAdornment: (
                <Button
                  variant="text"
                  type="submit"
                  sx={{ minWidth: 0, p: 0 }}
                  disabled={!messageInput}
                >
                  <PaperAirplaneIcon
                    style={{
                      width: '20px',
                      height: '20px',
                      color: 'rgb(29, 155, 240)',
                    }}
                  />
                </Button>
              ),
            }}
          />
        </form>
      </Box>
    </Stack>
  );
}
