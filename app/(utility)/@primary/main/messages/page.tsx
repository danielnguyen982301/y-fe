'use client';

import { Box, Stack } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

import apiService from '@/app/lib/apiService';
import { ChatUser, User } from '@/app/lib/definitions';
import { useChat } from '@/app/lib/hooks';
import socket from '@/app/lib/socket';
import ChatPanel from '@/app/ui/chat/chat-panel';
import ChatUserCard from '@/app/ui/chat/chat-user-card';
import SearchBar from '@/app/ui/search-bar';

export default function Page() {
  const { data } = useSession();

  const { chatUsers, setChatUsers, selectedChatUser, setSelectedChatUser } =
    useChat();

  const handleSendMessage = async (content: string) => {
    try {
      const response = await apiService.post('/messages', {
        content,
        to: selectedChatUser?._id,
      });
      if (selectedChatUser?._id === data?.currentUser._id) {
        await apiService.put(`/messages/status`, {
          messages: [response.data._id],
        });
      }
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
        .filter(({ isRead, from }) => !isRead && from !== data?.currentUser._id)
        .map((mes) => mes._id);
      if (unreadMessages.length) {
        await apiService.put('/messages/status', { messages: unreadMessages });
      }
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
      .filter(({ isRead, from }) => !isRead && from !== data?.currentUser._id)
      .map((mes) => mes._id);
    if (unreadMessages.length) {
      await apiService.put('/messages/status', { messages: unreadMessages });
    }
  };

  useEffect(() => {
    return () => {
      setSelectedChatUser(null);
    };
  }, [setSelectedChatUser]);

  return (
    <>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '990px',
        }}
      >
        <Stack
          sx={{
            width: { md: '350px', lg: '400px' },
            borderRight: '1px solid rgb(239, 243, 244)',
          }}
        >
          <Box>
            <Box
              sx={{ fontSize: { xs: 17, sm: 20 }, fontWeight: 'bold', p: 1 }}
            >
              Messages
            </Box>
          </Box>
          <Box
            sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <SearchBar
              chatUserSearch
              handleSelectChatUser={handleSelectChatUserFromSuggestions}
            />
          </Box>
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
            width: { md: '500px', lg: '550px' },
            borderRight: '1px solid rgb(239, 243, 244)',
          }}
        >
          {selectedChatUser && (
            <ChatPanel user={selectedChatUser} onMessage={handleSendMessage} />
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', sm: 'flex', md: 'none' },
          width: '990px',
        }}
      >
        <Stack
          sx={{
            display: selectedChatUser ? 'none' : 'flex',
            width: '500px',
            borderRight: '1px solid rgb(239, 243, 244)',
          }}
        >
          <Box>
            <Box
              sx={{ fontSize: { xs: 17, sm: 20 }, fontWeight: 'bold', p: 1 }}
            >
              Messages
            </Box>
          </Box>
          <Box
            sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <SearchBar
              chatUserSearch
              handleSelectChatUser={handleSelectChatUserFromSuggestions}
            />
          </Box>
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
        {selectedChatUser && (
          <Stack
            sx={{
              position: 'sticky',
              height: '100vh',
              width: '600px',
              borderRight: '1px solid rgb(239, 243, 244)',
            }}
          >
            <ChatPanel user={selectedChatUser} onMessage={handleSendMessage} />
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          width: '100%',
        }}
      >
        <Stack
          sx={{
            display: selectedChatUser ? 'none' : 'flex',
            width: '100%',
            borderRight: '1px solid rgb(239, 243, 244)',
          }}
        >
          <Box>
            <Box
              sx={{ fontSize: { xs: 17, sm: 20 }, fontWeight: 'bold', p: 1 }}
            >
              Messages
            </Box>
          </Box>
          <Box
            sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <SearchBar
              chatUserSearch
              handleSelectChatUser={handleSelectChatUserFromSuggestions}
            />
          </Box>
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
        {selectedChatUser && (
          <Stack
            sx={{
              height: '100vh',
              width: '100%',
              borderRight: '1px solid rgb(239, 243, 244)',
            }}
          >
            <ChatPanel user={selectedChatUser} onMessage={handleSendMessage} />
          </Stack>
        )}
      </Box>
    </>
  );
}
