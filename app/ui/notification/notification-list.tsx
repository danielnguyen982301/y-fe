'use client';

import apiService from '@/app/lib/apiService';
import { Follow, Post, Reply, User } from '@/app/lib/definitions';
import { useNotif } from '@/app/lib/hooks';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PostCard from '../post/post-card';
import ReplyCard from '../reply/reply-card';
import NotificationRepostCard from './notification-repost-card';
import NotificationFollowCard from './notification-follow-card';

export default function NotificationList({ tab }: { tab: string }) {
  const { notifs, setNotifs } = useNotif();
  if (tab === 'mention') {
    setNotifs(notifs.filter(({ event }) => event === 'mention'));
  }
  return (
    <Stack>
      {!!notifs.length &&
        notifs.map((notif) => {
          switch (notif.event) {
            case 'mention':
              if (notif.mentionLocationType === 'Post') {
                return (
                  <PostCard
                    key={notif.mentionLocation?._id}
                    post={notif.mentionLocation as Post}
                  />
                );
              } else {
                return (
                  <ReplyCard
                    key={notif.mentionLocation?._id}
                    reply={notif.mentionLocation as Reply}
                  />
                );
              }
            case 'repost':
              return (
                <NotificationRepostCard
                  key={notif.repost?._id}
                  sender={notif.sender}
                  repostType={notif.repostType as 'Post' | 'Reply'}
                  repost={notif.repost as Post | Reply}
                />
              );
            case 'follow':
              return (
                <NotificationFollowCard
                  key={notif.sender._id}
                  sender={notif.sender}
                />
              );
            case 'reply':
              return (
                <ReplyCard
                  key={notif.reply?._id}
                  reply={notif.reply as Reply}
                />
              );
            default:
              return null;
          }
        })}
    </Stack>
  );
}
