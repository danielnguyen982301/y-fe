'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import apiService from './lib/apiService';
import { isValidToken } from './lib/utils';
import { ChatUser, Message, User } from './lib/definitions';
import { useSession } from 'next-auth/react';
import socket from './lib/socket';

type ChatContextType = {
  chatUsers: ChatUser[];
  setChatUsers: Dispatch<SetStateAction<ChatUser[]>>;
  selectedChatUser: ChatUser | null;
  setSelectedChatUser: Dispatch<SetStateAction<ChatUser | null>>;
  newMessages: number;
};

export const ChatContext = createContext<ChatContextType>({
  chatUsers: [],
  setChatUsers: () => {},
  selectedChatUser: null,
  setSelectedChatUser: () => {},
  newMessages: 0,
});

export default function ChatProvider({ children }: { children: ReactNode }) {
  const { data } = useSession();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(
    null,
  );
  const newMessages = chatUsers.filter((user) =>
    user.messages.some(
      ({ isRead, from }) => !isRead && from !== data?.currentUser._id,
    ),
  ).length;

  useEffect(() => {
    const getChatUsers = async () => {
      try {
        const response = await apiService.get('/messages/users');
        setChatUsers(response.data.chatUsers);
      } catch (error) {}
    };
    getChatUsers();
  }, []);

  useEffect(() => {
    socket.on('privateMessage', async (message: Message) => {
      if (selectedChatUser?._id === message.from) {
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
        prevState && prevState._id === message.from
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

  return (
    <ChatContext.Provider
      value={{
        chatUsers,
        setChatUsers,
        selectedChatUser,
        setSelectedChatUser,
        newMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
