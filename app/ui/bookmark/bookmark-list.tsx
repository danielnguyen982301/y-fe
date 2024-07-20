import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import apiService from '@/app/lib/apiService';
import { Bookmark, Reply } from '@/app/lib/definitions';
import ReplyCard from '../reply/reply-card';
import PostCard from '../post/post-card';
import LoadingScreen from '../loading-screen';

export default function BookmarkList() {
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getBookmarks = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/bookmarks`);
        setTotalPages(response.data.totalPages);
        currentPage === 1
          ? setBookmarks(response.data.bookmarks)
          : setBookmarks((prevState) => [
              ...prevState,
              ...response.data.bookmarks,
            ]);
        setLoading(false);
      } catch (error) {}
    };
    getBookmarks();
  }, [currentPage]);

  return loading && currentPage === 1 ? (
    <LoadingScreen />
  ) : (
    <Stack sx={{ width: '100%' }}>
      {!!bookmarks?.length && (
        <InfiniteScroll
          dataLength={bookmarks.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={bookmarks.length >= 10 && currentPage < totalPages}
          loader={<LoadingScreen />}
        >
          {bookmarks.map((bookmark) =>
            bookmark.targetType === 'Reply' ? (
              <ReplyCard
                key={bookmark.target._id}
                reply={bookmark.target as Reply}
              />
            ) : (
              <PostCard key={bookmark.target._id} post={bookmark.target} />
            ),
          )}
        </InfiniteScroll>
      )}
    </Stack>
  );
}
