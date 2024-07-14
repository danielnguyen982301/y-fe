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
import { ChatUser, Message, Notification, User } from './lib/definitions';
import { useSession } from 'next-auth/react';
import socket from './lib/socket';

type NotifContextType = {
  notifs: Notification[];
  setNotifs: Dispatch<SetStateAction<Notification[]>>;
  newNotifs: number;
};

export const NotifContext = createContext<NotifContextType>({
  notifs: [],
  setNotifs: () => {},
  newNotifs: 0,
});

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data } = useSession();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  const newNotifs = notifs.filter(({ isRead }) => !isRead).length;

  useEffect(() => {
    if (!data || !isValidToken(data.accessToken)) return;
    const getNotifs = async () => {
      try {
        const response = await apiService.get('/notifications');
        setNotifs(response.data.notifs);
      } catch (error) {
        console.log(error);
      }
    };
    getNotifs();
  }, [data, notifCount]);

  useEffect(() => {
    socket.on('mentionNotif', () => {
      setNotifCount(notifCount + 1);
    });

    socket.on('replyNotif', () => {
      setNotifCount(notifCount + 1);
    });

    return () => {
      socket.off('mentionNotif');
      socket.off('replyNotif');
    };
  }, [data, notifCount]);

  return (
    <NotifContext.Provider
      value={{
        notifs,
        setNotifs,
        newNotifs,
      }}
    >
      {children}
    </NotifContext.Provider>
  );
}
