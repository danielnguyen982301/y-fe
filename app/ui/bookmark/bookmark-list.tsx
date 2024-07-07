import apiService from '@/app/lib/apiService';
import { Bookmark, Reply, User } from '@/app/lib/definitions';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReplyCard from '../reply/reply-card';
import PostCard from '../post/post-card';

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const getBookmarks = async () => {
      try {
        const response = await apiService.get(`/bookmarks`);
        setBookmarks(response.data.bookmarks);
      } catch (error) {
        console.log(error);
      }
    };
    getBookmarks();
  }, []);

  return (
    <Stack sx={{ width: '100%' }}>
      {!!bookmarks?.length &&
        bookmarks.map((bookmark) =>
          bookmark.targetType === 'Reply' ? (
            <ReplyCard
              key={bookmark.target._id}
              reply={bookmark.target as Reply}
            />
          ) : (
            <PostCard key={bookmark.target._id} post={bookmark.target} />
          ),
        )}
    </Stack>
  );
}
