'use client';

import {
  BookmarkIcon,
  ChartBarIcon,
  HeartIcon as LikedHeart,
} from '@heroicons/react/20/solid';
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon as OutlineBookmark,
  ChatBubbleOvalLeftIcon,
  HeartIcon as UnlikedHeart,
} from '@heroicons/react/24/outline';
import { Box, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { Post } from '@/app/lib/definitions';
import socket from '@/app/lib/socket';

const iconStyles = {
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function PostStats({
  post,
  detailed,
  newReplyCount,
}: {
  post: Post;
  detailed?: boolean;
  newReplyCount?: number;
}) {
  const stats = useMemo(
    () => ({
      likeCount: post?.likeCount,
      viewCount: post?.viewCount,
      repostCount: post?.repostCount,
      replyCount: newReplyCount ?? post?.replyCount,
      bookmarkCount: post?.bookmarkCount,
    }),
    [post, newReplyCount],
  );

  const states = useMemo(
    () => ({
      isLiked: post?.isLiked,
      isReposted: post?.isReposted,
      isBookmarked: post?.isBookmarked,
    }),
    [post],
  );

  const [postStats, setPostStats] = useState(stats);
  const [postStates, setPostStates] = useState(states);

  useEffect(() => {
    setPostStats(stats);
    setPostStates(states);
  }, [stats, states]);

  const handleToggleLike = async (postId: string) => {
    try {
      const response = await apiService.post('/likes', {
        targetType: 'Post',
        target: postId,
      });
      setPostStats({ ...postStats, likeCount: response.data.likeCount });
      setPostStates({ ...postStates, isLiked: !postStates.isLiked });
    } catch (error) {}
  };

  const handleToggleRepost = async (postId: string) => {
    try {
      const response = postStates.isReposted
        ? await apiService.delete(`/posts/repost/`, {
            data: {
              repostId: postId,
            },
          })
        : await apiService.post('/posts/repost', {
            repostType: 'Post',
            repostId: postId,
          });

      if (response.data.notif) {
        socket.emit(
          'toggleRepostNotif',
          postStates.isReposted
            ? { ...response.data.notif, delete: true }
            : response.data.notif,
        );
      }
      setPostStats({ ...postStats, repostCount: response.data.repostCount });
      setPostStates({ ...postStates, isReposted: !postStates.isReposted });
    } catch (error) {}
  };

  const handleToggleBookmark = async (postId: string) => {
    try {
      const response = postStates.isBookmarked
        ? await apiService.delete(`/bookmarks`, {
            data: {
              targetType: 'Post',
              targetId: postId,
            },
          })
        : await apiService.post('/bookmarks', {
            targetType: 'Post',
            targetId: postId,
          });
      if (detailed) {
        setPostStats({
          ...postStats,
          bookmarkCount: response.data.bookmarkCount,
        });
      }
      setPostStates({ ...postStates, isBookmarked: !postStates.isBookmarked });
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: detailed ? '1px solid rgb(239, 243, 244)' : '',
        borderBottom: detailed ? '1px solid rgb(239, 243, 244)' : '',
        py: detailed ? 1 : 0,
        my: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            ...iconStyles,
            color: 'rgb(83, 100, 113)',
            '&:hover': {
              cursor: 'pointer',
              borderRadius: 9999,
              bgcolor: 'rgba(29,155,240,0.1)',
              color: 'rgba(29,155,240)',
            },
          }}
        >
          <ChatBubbleOvalLeftIcon height="20px" width="20px" />
        </Box>
        {!!postStats.replyCount && (
          <Typography sx={{ position: 'relative', right: 4 }}>
            {postStats.replyCount}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip
          title={postStates.isReposted ? 'Undo Repost' : 'Repost'}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleToggleRepost(post?._id);
            }}
            sx={{
              ...iconStyles,
              color: postStates.isReposted
                ? 'rgba(0,186,124)'
                : 'rgb(83, 100, 113)',
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 9999,
                bgcolor: 'rgba(0,186,124,0.1)',
                color: 'rgba(0,186,124)',
              },
            }}
          >
            <ArrowPathRoundedSquareIcon height="20px" width="20px" />
          </Box>
        </Tooltip>
        {!!postStats.repostCount && (
          <Typography
            sx={{
              position: 'relative',
              right: 4,
              color: postStates.isReposted
                ? 'rgba(0,186,124)'
                : 'rgb(83, 100, 113)',
            }}
          >
            {postStats.repostCount}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip
          title={postStates.isLiked ? 'Unlike' : 'Like'}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLike(post?._id);
            }}
            sx={{
              ...iconStyles,
              color: postStates.isLiked
                ? 'rgba(249,24,128)'
                : 'rgb(83, 100, 113)',
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 9999,
                bgcolor: 'rgba(249,24,128,0.1)',
                color: 'rgba(249,24,128)',
              },
            }}
          >
            {postStates.isLiked ? (
              <LikedHeart height="20px" width="20px" />
            ) : (
              <UnlikedHeart height="20px" width="20px" />
            )}
          </Box>
        </Tooltip>
        {!!postStats.likeCount && (
          <Typography
            sx={{
              position: 'relative',
              right: 4,
              color: postStates.isLiked
                ? 'rgb(249, 24, 128)'
                : 'rgb(83, 100, 113)',
            }}
          >
            {postStats.likeCount}
          </Typography>
        )}
      </Box>
      {!detailed && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              ...iconStyles,
            }}
          >
            <ChartBarIcon height="20px" width="20px" />
          </Box>
          {!!postStats.viewCount && (
            <Typography
              sx={{
                position: 'relative',
                right: 4,
                color: 'rgb(83, 100, 113)',
              }}
            >
              {postStats.viewCount}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip
          title={postStates.isBookmarked ? 'Remove from Bookmarks' : 'Bookmark'}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBookmark(post?._id);
            }}
            sx={{
              ...iconStyles,
              color: postStates.isBookmarked
                ? 'rgba(29,155,240)'
                : 'rgb(83, 100, 113)',
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 9999,
                bgcolor: 'rgba(29,155,240,0.1)',
                color: 'rgba(29,155,240)',
              },
            }}
          >
            {postStates.isBookmarked ? (
              <BookmarkIcon height="20px" width="20px" />
            ) : (
              <OutlineBookmark height="20px" width="20px" />
            )}
          </Box>
        </Tooltip>
        {detailed && !!postStats.bookmarkCount && (
          <Typography
            sx={{
              position: 'relative',
              right: 4,
              color: postStates.isBookmarked
                ? 'rgba(29,155,240)'
                : 'rgb(83, 100, 113)',
            }}
          >
            {postStats.bookmarkCount}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
