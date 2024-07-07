'use client';

import { Post, Reply, Thread } from '@/app/lib/definitions';
import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import NextImage from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ArrowPathRoundedSquareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useUserData } from '@/app/lib/hooks';
import Link from 'next/link';
import apiService from '@/app/lib/apiService';
import { useSession } from 'next-auth/react';
import ReplyStats from './reply-stats';
import { useRouter } from 'next/navigation';
import { transformedContent } from '../form/form-mention-textfield';
import DeleteConfirmModal from '../modal/delete-confirm-modal';

export default function ReplyCard({
  reply,
  direct,
  chained,
  setUpdatedTarget,
}: {
  reply: Reply;
  chained?: boolean;
  direct?: boolean;
  setUpdatedTarget?: Dispatch<
    SetStateAction<Post | { reply: Reply; replyCount: number } | null>
  >;
}) {
  const { data } = useSession();
  const router = useRouter();
  const [anchorEl, setAncholEl] = useState<HTMLElement | null>(null);
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  const [openModal, setOpenModal] = useState(false);
  const relationship = reply.author.relationship;
  const [isFollowed, setIsFollowed] = useState(
    relationship === 'followedByCurrentUser' ||
      relationship === 'followEachOther',
  );

  const transformedReplyContent = transformedContent({
    content: reply?.content,
    regex: /(#\w+)/gm,
  });

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
    <>
      <Stack
        onClick={() =>
          router.push(
            `/main/${data?.currentUser.username}/replies/${reply?._id}`,
          )
        }
        sx={{
          width: '100%',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            px: 2,
            py: 1,
            borderBottom: chained ? '' : '1px solid rgb(239, 243, 244)',
          }}
        >
          <Stack sx={{ alignItems: 'center', position: 'relative' }}>
            {chained && (
              <Box
                sx={{
                  position: 'absolute',
                  width: 2,
                  height: 'calc(100% + 16px)',
                  border: '0 solid black',
                  bgcolor: 'rgb(207, 217, 222)',
                  top: -8,
                  zIndex: -1,
                }}
              ></Box>
            )}
            <Avatar src={reply.author.avatar} alt={reply.author.username} />
          </Stack>
          <Stack sx={{ flexGrow: 1, pl: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography
                  component="span"
                  sx={{
                    pr: 1,
                    color: 'rgb(15, 20, 25)',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {reply.author.displayName}
                </Typography>
                <Typography
                  component="span"
                  sx={{ color: 'rgb(83, 100, 113)', fontSize: 15 }}
                >
                  @{reply.author.username}
                </Typography>

                <Typography
                  component="span"
                  sx={{
                    color: 'rgb(83, 100, 113)',
                    fontSize: 15,
                    '&::before': {
                      content: `"•"`,
                      mx: 1,
                    },
                  }}
                >
                  {replyTime}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  position: 'relative',
                  right: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    alignItems: 'center',
                    height: '40px',
                    width: '40px',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(29,155,240,0.1)',
                      color: 'rgb(29,155,240)',
                      borderRadius: '50%',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAncholEl(e.currentTarget);
                  }}
                >
                  <EllipsisHorizontalIcon width={25} height={25} />
                </Box>
              </Box>
            </Box>
            {!direct && (
              <Box>
                <Typography sx={{ color: 'rgb(83, 100, 113)', fontSize: 15 }}>
                  Replying to @
                  {(reply?.target as Post | Reply)?.author?.username}
                </Typography>
              </Box>
            )}
            <Box sx={{ mb: 1 }}>{transformedReplyContent}</Box>
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
            <ReplyStats reply={reply} />
          </Stack>
        </Box>
      </Stack>
      <Menu
        sx={{ mt: 3 }}
        onClick={() => setAncholEl(null)}
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
            <MenuItem
              sx={{ fontWeight: 'bold' }}
              onClick={() => router.push(`/compose/edit/reply/${reply._id}`)}
            >
              Edit
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 'bold' }}
              onClick={() => setOpenModal(true)}
            >
              Delete
            </MenuItem>
          </Box>
        ) : (
          <MenuItem
            sx={{ fontWeight: 'bold' }}
            onClick={() => handleToggleFollow(reply.author._id)}
          >
            {isFollowed ? 'Unfollow' : 'Follow'} @{reply.author.username}
          </MenuItem>
        )}
      </Menu>
      <DeleteConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        targetType="reply"
        targetId={reply?._id}
        setUpdatedTarget={chained ? undefined : setUpdatedTarget}
        chainedOrDetailed={chained}
      />
    </>
  );
}
