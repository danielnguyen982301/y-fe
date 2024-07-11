'use client';

import apiService from '@/app/lib/apiService';
import { ChatUser, User } from '@/app/lib/definitions';
import { useUserData } from '@/app/lib/hooks';
import socket from '@/app/lib/socket';
import ChatPanel from '@/app/ui/chat/chat-panel';
import ChatUserCard from '@/app/ui/chat/chat-user-card';
import LikeList from '@/app/ui/like/like-list';
import PostList from '@/app/ui/post/post-list';
import ReplyList from '@/app/ui/reply/reply-list';
import SearchBar from '@/app/ui/search-bar';
import UserProfile from '@/app/ui/user/user-profile';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(
    null,
  );
  const [messageContent, setMessageContent] = useState('');
  const { data } = useSession();

  const handleSendMessage = (content: string) => {
    if (selectedChatUser) {
      socket.emit('privateMessage', {
        content,
        to: selectedChatUser.userId,
      });
      setMessageContent(content);
      setSelectedChatUser({
        ...selectedChatUser,
        messages: [...selectedChatUser.messages, { content, fromSelf: true }],
      });
    }
  };

  useEffect(() => {
    socket.emit('getChatUsers');
    socket.on('users', (users: any) => {
      const mappedUsers = users.map((user: any) => ({
        ...user,
        messages: user.messages.map((message: any) => ({
          content: message.content,
          fromSelf: message.from === socket.userId,
        })),
      }));
      setChatUsers(mappedUsers);
    });

    socket.on('privateMessage', ({ content, from, to }) => {
      setChatUsers((prevState) =>
        prevState.map((user) => {
          const fromSelf = socket.userId === from;
          if (user.userId === (fromSelf ? to : from)) {
            return {
              ...user,
              messages: [...user.messages, { content, fromSelf }],
            };
          }
          return user;
        }),
      );
      const message = { content, fromSelf: socket.userId === from };
      setSelectedChatUser((prevState) =>
        prevState
          ? { ...prevState, messages: [...prevState?.messages, message] }
          : null,
      );
    });
    return () => {
      socket.off('user');
      socket.off('privateMessage');
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '990px' }}>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Box>
          <Box>Messages</Box>
        </Box>
        <SearchBar
          chatUserSearch
          chatUsers={chatUsers}
          setChatUsers={setChatUsers}
          setSelectedChatUser={setSelectedChatUser}
        />
        <Stack>
          {chatUsers.map((user) => (
            <ChatUserCard
              key={user.userId}
              chatUser={user}
              setSelectedChatUser={setSelectedChatUser}
            />
          ))}
        </Stack>
      </Stack>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          borderRight: '1px solid rgb(239, 243, 244)',
        }}
      >
        {selectedChatUser && (
          <ChatPanel user={selectedChatUser} onMessage={handleSendMessage} />
        )}
      </Stack>
    </Box>
  );
}
