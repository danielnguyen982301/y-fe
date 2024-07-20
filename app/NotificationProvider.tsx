'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
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
  unreadNotifCount: number;
  setUnreadNotifCount: Dispatch<SetStateAction<number>>;
  isNotifMounted: boolean;
  setIsNotifMounted: Dispatch<SetStateAction<boolean>>;
};

export const NotifContext = createContext<NotifContextType>({
  notifs: [],
  setNotifs: () => {},
  unreadNotifCount: 0,
  setUnreadNotifCount: () => {},
  isNotifMounted: true,
  setIsNotifMounted: () => {},
});

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [actionCount, setActionCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifMounted, setIsNotifMounted] = useState(false);

  useEffect(() => {
    const getNotifs = async () => {
      try {
        const response = await apiService.get('/notifications');
        setNotifs(response.data.notifs);
        setUnreadNotifCount(
          response.data.notifs.filter(
            ({ isRead }: { isRead: boolean }) => !isRead,
          ).length,
        );
      } catch (error) {
        console.log(error);
      }
    };
    getNotifs();
  }, [actionCount]);

  useEffect(() => {
    socket.on('mentionNotif', () => {
      setActionCount(actionCount + 1);
    });

    socket.on('replyNotif', () => {
      setActionCount(actionCount + 1);
    });

    socket.on('toggleRepostNotif', (repostNotif) => {
      if (repostNotif.delete) {
        setNotifs(notifs.filter(({ _id }) => _id !== repostNotif._id));
        setUnreadNotifCount(unreadNotifCount ? unreadNotifCount - 1 : 0);
      } else {
        setNotifs([repostNotif, ...notifs]);
        setUnreadNotifCount(unreadNotifCount + 1);
      }
    });

    socket.on('toggleFollowNotif', (followNotif) => {
      if (followNotif.delete) {
        setNotifs(notifs.filter(({ _id }) => _id !== followNotif._id));
        setUnreadNotifCount(unreadNotifCount ? unreadNotifCount - 1 : 0);
      } else {
        setNotifs([followNotif, ...notifs]);
        setUnreadNotifCount(unreadNotifCount + 1);
      }
    });

    socket.on('deleteNotif', () => {
      setActionCount(actionCount + 1);
    });

    return () => {
      socket.off('mentionNotif');
      socket.off('replyNotif');
      socket.off('toggleRepostNotif');
      socket.off('toggleFollowNotif');
      socket.off('deleteNotif');
    };
  }, [actionCount, notifs, unreadNotifCount]);

  return (
    <NotifContext.Provider
      value={{
        notifs,
        setNotifs,
        unreadNotifCount,
        setUnreadNotifCount,
        isNotifMounted,
        setIsNotifMounted,
      }}
    >
      {children}
    </NotifContext.Provider>
  );
}
