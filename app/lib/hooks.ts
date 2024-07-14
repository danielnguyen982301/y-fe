'use client';

import { useContext } from 'react';
import { ChatContext } from '../ChatProvider';
import { NotifContext } from '../NotificationProvider';

export const useChat = () => {
  return useContext(ChatContext);
};

export const useNotif = () => {
  return useContext(NotifContext);
};
