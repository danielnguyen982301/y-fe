'use client';

import apiService from '@/app/lib/apiService';
import { Reply } from '@/app/lib/definitions';
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

export default function ReplyStats({
  reply,
  detailed,
  newReplyCount,
}: {
  reply: Reply;
  detailed?: boolean;
  newReplyCount?: number;
}) {
  const stats = useMemo(
    () => ({
      likeCount: reply?.likeCount,
      viewCount: reply?.viewCount,
      repostCount: reply?.repostCount,
      replyCount: newReplyCount ?? reply?.replyCount,
      bookmarkCount: reply?.bookmarkCount,
    }),
    [reply, newReplyCount],
  );

  const states = useMemo(
    () => ({
      isLiked: reply?.isLiked,
      isReposted: reply?.isReposted,
      isBookmarked: reply?.isBookmarked,
    }),
    [reply],
  );

  const [replyStats, setReplyStats] = useState(stats);
  const [replyStates, setReplyStates] = useState(states);

  useEffect(() => {
    setReplyStats(stats);
    setReplyStates(states);
  }, [stats, states]);

  const handleToggleLike = async (replyId: string) => {
    try {
      const response = await apiService.post('/likes', {
        targetType: 'Reply',
        target: replyId,
      });
      setReplyStats({ ...replyStats, likeCount: response.data.likeCount });
      setReplyStates({ ...replyStates, isLiked: !replyStates.isLiked });
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleRepost = async (replyId: string) => {
    try {
      const response = replyStates.isReposted
        ? await apiService.delete(`/replies/repost/`, {
            data: {
              repostId: replyId,
            },
          })
        : await apiService.post('/replies/repost', {
            repostType: 'Reply',
            repostId: replyId,
          });
      setReplyStats({ ...replyStats, repostCount: response.data.repostCount });
      setReplyStates({ ...replyStates, isReposted: !replyStates.isReposted });
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleBookmark = async (replyId: string) => {
    try {
      const response = replyStates.isBookmarked
        ? await apiService.delete(`/bookmarks`, {
            data: {
              targetType: 'Reply',
              targetId: replyId,
            },
          })
        : await apiService.post('/bookmarks', {
            targetType: 'Reply',
            targetId: replyId,
          });
      if (detailed) {
        setReplyStats({
          ...replyStats,
          bookmarkCount: response.data.bookmarkCount,
        });
      }
      setReplyStates({
        ...replyStates,
        isBookmarked: !replyStates.isBookmarked,
      });
    } catch (error) {
      console.log(error);
    }
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
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
        {!!replyStats.replyCount && (
          <Typography sx={{ position: 'relative', right: 4 }}>
            {replyStats.replyCount}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip
          title={replyStates.isReposted ? 'Undo Repost' : 'Repost'}
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
              handleToggleRepost(reply?._id);
            }}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: replyStates.isReposted
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
        {!!replyStats.repostCount && (
          <Typography
            sx={{
              position: 'relative',
              right: 4,
              color: replyStates.isReposted
                ? 'rgba(0,186,124)'
                : 'rgb(83, 100, 113)',
            }}
          >
            {replyStats.repostCount}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip
          title={replyStates.isLiked ? 'Unlike' : 'Like'}
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
              handleToggleLike(reply?._id);
            }}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: replyStates.isLiked
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
            {replyStates.isLiked ? (
              <LikedHeart height="20px" width="20px" />
            ) : (
              <UnlikedHeart height="20px" width="20px" />
            )}
          </Box>
        </Tooltip>
        {!!replyStats.likeCount && (
          <Typography
            sx={{
              position: 'relative',
              right: 4,
              color: replyStates.isLiked
                ? 'rgb(249, 24, 128)'
                : 'rgb(83, 100, 113)',
            }}
          >
            {replyStats.likeCount}
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
          {!!replyStats.viewCount && (
            <Typography
              sx={{
                position: 'relative',
                right: 4,
                color: 'rgb(83, 100, 113)',
              }}
            >
              {replyStats.viewCount}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip
          title={
            replyStates.isBookmarked ? 'Remove from Bookmarks' : 'Bookmark'
          }
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
              handleToggleBookmark(reply?._id);
            }}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: replyStates.isBookmarked
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
            {replyStates.isBookmarked ? (
              <BookmarkIcon height="20px" width="20px" />
            ) : (
              <OutlineBookmark height="20px" width="20px" />
            )}
          </Box>
        </Tooltip>
        {detailed && !!replyStats.bookmarkCount && (
          <Typography
            sx={{
              position: 'relative',
              right: 4,
              color: replyStates.isBookmarked
                ? 'rgba(29,155,240)'
                : 'rgb(83, 100, 113)',
            }}
          >
            {replyStats.bookmarkCount}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
