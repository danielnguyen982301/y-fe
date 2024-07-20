'use client';

import { Stack } from '@mui/material';

import { Notification, Post, Reply } from '@/app/lib/definitions';
import PostCard from '../post/post-card';
import ReplyCard from '../reply/reply-card';
import NotificationRepostCard from './notification-repost-card';
import NotificationFollowCard from './notification-follow-card';

export default function NotificationList({
  notifs,
}: {
  notifs: Notification[];
}) {
  return (
    <Stack>
      {!!notifs.length &&
        notifs.map((notif) => {
          switch (notif.event) {
            case 'mention':
              if (notif.mentionLocationType === 'Post') {
                return (
                  <PostCard
                    key={notif._id}
                    post={notif.mentionLocation as Post}
                    isNotifRead={notif.isRead}
                  />
                );
              } else {
                return (
                  <ReplyCard
                    key={notif._id}
                    reply={notif.mentionLocation as Reply}
                    isNotifRead={notif.isRead}
                  />
                );
              }
            case 'repost':
              return (
                <NotificationRepostCard
                  key={notif._id}
                  sender={notif.sender}
                  repostType={notif.repostType as 'Post' | 'Reply'}
                  repost={notif.repost as Post | Reply}
                  isNotifRead={notif.isRead}
                />
              );
            case 'follow':
              return (
                <NotificationFollowCard
                  key={notif._id}
                  sender={notif.sender}
                  isNotifRead={notif.isRead}
                />
              );
            case 'reply':
              return (
                <ReplyCard
                  key={notif._id}
                  reply={notif.reply as Reply}
                  isNotifRead={notif.isRead}
                />
              );
            default:
              return null;
          }
        })}
    </Stack>
  );
}
