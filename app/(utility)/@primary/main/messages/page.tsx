'use client';

import apiService from '@/app/lib/apiService';
import { ChatUser, Message, User } from '@/app/lib/definitions';
import socket from '@/app/lib/socket';
import ChatPanel from '@/app/ui/chat/chat-panel';
import ChatUserCard from '@/app/ui/chat/chat-user-card';
import SearchBar from '@/app/ui/search-bar';
import { Box, Stack } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const { data } = useSession();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(
    null,
  );
  const newMessages = chatUsers.filter((user) =>
    user.messages.some(({ isRead }) => !isRead),
  ).length;

  const handleSendMessage = async (content: string) => {
    try {
      const response = await apiService.post('/messages', {
        content,
        to: selectedChatUser?._id,
      });
      socket.emit('privateMessage', response.data);
      setSelectedChatUser(
        selectedChatUser
          ? {
              ...selectedChatUser,
              messages: [
                ...selectedChatUser.messages.map((mes) => ({
                  ...mes,
                  isRead: true,
                })),
                { ...response.data, isRead: true },
              ],
            }
          : null,
      );
      setChatUsers(
        chatUsers.map((user) => {
          if (user._id === selectedChatUser?._id) {
            return {
              ...user,
              messages: [...user.messages, { ...response.data, isRead: true }],
            };
          }
          return user;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChatUserFromSuggestions = async (selectedUser: User) => {
    const existingChatUser = chatUsers.find(
      ({ _id }) => _id === selectedUser._id,
    );
    if (existingChatUser) {
      setSelectedChatUser(existingChatUser);
      setChatUsers(
        chatUsers.map((user) => {
          if (existingChatUser._id === user._id) {
            return {
              ...user,
              messages: user.messages.map((mes) => ({ ...mes, isRead: true })),
            };
          }
          return user;
        }),
      );
      const unreadMessages = existingChatUser.messages
        .filter(({ isRead }) => !isRead)
        .map((mes) => mes._id);
      await apiService.put('/messages/status', { messages: unreadMessages });
    } else {
      const chatUser: ChatUser = {
        ...selectedUser,
        messages: [],
      };
      setChatUsers([chatUser, ...chatUsers]);
      setSelectedChatUser(chatUser);
    }
  };

  const handleSelectChatUser = async (selectedUser: ChatUser) => {
    setSelectedChatUser(selectedUser);
    setChatUsers(
      chatUsers.map((user) => {
        if (selectedUser._id === user._id) {
          return {
            ...user,
            messages: user.messages.map((mes) => ({ ...mes, isRead: true })),
          };
        }
        return user;
      }),
    );
    const unreadMessages = selectedUser.messages
      .filter(({ isRead }) => !isRead)
      .map((mes) => mes._id);
    await apiService.put('/messages/status', { messages: unreadMessages });
  };

  useEffect(() => {
    const getChatUsers = async () => {
      try {
        const response = await apiService.get('/messages/users');
        setChatUsers(response.data.chatUsers);
      } catch (error) {
        console.log(error);
      }
    };
    getChatUsers();
  }, []);

  useEffect(() => {
    socket.on('privateMessage', async (message: Message) => {
      if (
        selectedChatUser?._id === message.from ||
        selectedChatUser?._id === message.to
      ) {
        await apiService.put('/messages/status', { messages: [message._id] });
      }
      if (
        message.to === data?.currentUser._id &&
        !chatUsers.some((user) => user._id === message.from)
      ) {
        const response = await apiService.get(
          `/messages/users/${message.from}`,
        );
        setChatUsers([response.data, ...chatUsers]);
      } else {
        setChatUsers((prevState) =>
          prevState.map((user) => {
            const fromSelf = data?.currentUser._id === message.from;
            if (user._id === (fromSelf ? message.to : message.from)) {
              return {
                ...user,
                messages: [
                  ...user.messages,
                  {
                    ...message,
                    isRead: user._id === selectedChatUser?._id ? true : false,
                  },
                ],
              };
            }
            return user;
          }),
        );
      }
      setSelectedChatUser((prevState) =>
        prevState &&
        (prevState._id === message.from || prevState._id === message.to)
          ? {
              ...prevState,
              messages: [...prevState?.messages, { ...message, isRead: true }],
            }
          : prevState,
      );
    });
    return () => {
      socket.off('privateMessage');
    };
  }, [data, selectedChatUser, chatUsers]);

  useEffect(() => {
    socket.emit('newMessages', newMessages);
  }, [newMessages]);

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
          handleSelectChatUser={handleSelectChatUserFromSuggestions}
        />
        <Stack>
          {chatUsers.map((user) => (
            <ChatUserCard
              isSelected={selectedChatUser?._id === user._id}
              key={user._id}
              user={user}
              handleSelectChatUser={handleSelectChatUser}
            />
          ))}
        </Stack>
      </Stack>
      <Stack
        sx={{
          position: 'sticky',
          height: '100vh',
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
