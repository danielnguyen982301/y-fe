'use client';

import { Post, Reply, Thread } from '@/app/lib/definitions';
import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import NextImage from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  ArrowPathRoundedSquareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useUserData } from '@/app/lib/hooks';
import Link from 'next/link';
import apiService from '@/app/lib/apiService';
import { useSession } from 'next-auth/react';
import ReplyStats from './reply-stats';

export default function ReplyCard({
  reply,
  detailed,
  direct,
}: {
  reply: Reply;
  detailed?: boolean;
  direct?: boolean;
}) {
  const { data } = useSession();
  const [anchorEl, setAncholEl] = useState<HTMLElement | null>(null);
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  const relationship = reply.author.relationship;
  const [isFollowed, setIsFollowed] = useState(
    relationship === 'followedByCurrentUser' ||
      relationship === 'followEachOther',
  );

  const transformContent = (content: string) => {
    const regex = /(#\w+)/gm;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (lastIndex < match.index) {
        parts.push(content.substring(lastIndex, match.index));
      }

      parts.push(
        <Link
          className="hover:underline"
          href={`/explore?q=${match[1]}`}
          style={{ color: 'rgb(29, 155, 240)' }}
          key={match.index}
        >
          {match[1]}
        </Link>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  const replyDate = new Date(reply.createdAt);
  const currentDate = new Date();
  const timeDiff = Date.now() - replyDate.getTime();
  const replyTime =
    timeDiff < 1000 * 60
      ? `${Math.floor(timeDiff / 1000)}s`
      : timeDiff < 1000 * 60 * 60
      ? `${Math.floor(timeDiff / (1000 * 60))}m`
      : timeDiff < 1000 * 60 * 60 * 24
      ? `${Math.floor(timeDiff / (1000 * 60 * 60))}h`
      : currentDate.getFullYear() === replyDate.getFullYear()
      ? replyDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : replyDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

  useEffect(() => {
    if (reply.mediaFile) {
      const img = new Image();
      img.src = reply.mediaFile;
      img.onload = () => {
        setImageSizes({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [reply]);

  const handleToggleFollow = async (userId: string) => {
    setAncholEl(null);
    try {
      isFollowed
        ? await apiService.delete('/follows', { data: { followeeId: userId } })
        : await apiService.post('/follows', { followeeId: userId });
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack sx={{ width: '100%' }}>
      {/* {isRepost && (
        <Box>
          <Box>
            <ArrowPathRoundedSquareIcon />
          </Box>
          <Box>{}</Box>
        </Box>
      )} */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          p: 1,
          // borderTop: '1px solid rgb(239, 243, 244)',
          borderBottom: '1px solid rgb(239, 243, 244)',
        }}
      >
        <Stack>
          <Avatar src={reply.author.avatar} alt={reply.author.username} />
        </Stack>
        <Stack sx={{ flexGrow: 1, pl: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography component="span" sx={{ pr: 1 }}>
                {reply.author.displayName}
              </Typography>
              <Typography component="span" sx={{ color: 'grey' }}>
                @{reply.author.username}
              </Typography>
              {!detailed && (
                <Typography
                  component="span"
                  sx={{
                    '&::before': {
                      content: `"•"`,
                      mx: 1,
                    },
                  }}
                >
                  {replyTime}
                </Typography>
              )}
            </Box>
            <Box
              sx={{ height: '25px', width: '25px', cursor: 'pointer' }}
              onClick={(e) => setAncholEl(e.currentTarget)}
            >
              <EllipsisHorizontalIcon />
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAncholEl(null)}
            >
              {data?.currentUser._id === reply.author._id ? (
                <Box>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </Box>
              ) : (
                <MenuItem onClick={() => handleToggleFollow(reply.author._id)}>
                  {isFollowed ? 'Unfollow' : 'Follow'} @{reply.author.username}
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Box sx={{ py: 1 }}>{transformContent(reply.content)}</Box>
          {reply.mediaFile && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pb: 1,
              }}
            >
              <NextImage
                src={reply.mediaFile}
                alt="reply-image"
                width={imageSizes.width > 510 ? 510 : imageSizes.width}
                height={imageSizes.height}
              />
            </Box>
          )}
          {detailed && (
            <Box>
              <Typography>
                {replyDate.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Typography>
              <Typography
                sx={{
                  '&::before': {
                    content: `"•"`,
                    mx: 1,
                  },
                }}
              >
                {replyDate.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Typography>
              <Typography
                sx={{
                  '&::before': {
                    content: `"•"`,
                    mx: 1,
                  },
                }}
              >
                <Typography component="strong">{reply.viewCount}</Typography>
                Views
              </Typography>
            </Box>
          )}
          <ReplyStats reply={reply} />
        </Stack>
      </Box>
    </Stack>
  );
}
