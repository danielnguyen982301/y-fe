'use client';

import apiService from '@/app/lib/apiService';
import { Post } from '@/app/lib/definitions';
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
import React, { useState } from 'react';

export default function PostStats({
  post,
  detailed,
}: {
  post: Post;
  detailed?: boolean;
}) {
  const stats = {
    likeCount: post.likeCount,
    viewCount: post.viewCount,
    repostCount: post.repostCount,
    replyCount: post.replyCount,
    bookmarkCount: post.bookmarkCount,
  };

  const states = {
    isLiked: post.isLiked,
    isReposted: post.isReposted,
    isBookmarked: post.isBookmarked,
  };

  const [postStats, setPostStats] = useState(stats);
  const [postStates, setPostStates] = useState(states);

  const handleToggleLike = async (postId: string) => {
    try {
      const response = await apiService.post('/likes', {
        targetType: 'Post',
        target: postId,
      });
      setPostStats({ ...postStats, likeCount: response.data.likeCount });
      setPostStates({ ...postStates, isLiked: !postStates.isLiked });
    } catch (error) {
      console.log(error);
    }
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
      setPostStats({ ...postStats, repostCount: response.data.repostCount });
      setPostStates({ ...postStates, isReposted: !postStates.isReposted });
    } catch (error) {
      console.log(error);
    }
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
      // setPostStats({ ...postStats, repostCount: response.data.repostCount });
      setPostStates({ ...postStates, isBookmarked: !postStates.isBookmarked });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          <Typography>{postStats.replyCount}</Typography>
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
            onClick={() => handleToggleRepost(post._id)}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            onClick={() => handleToggleLike(post._id)}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            onClick={() => handleToggleBookmark(post._id)}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
