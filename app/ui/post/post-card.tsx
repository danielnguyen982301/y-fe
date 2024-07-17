'use client';

import { Post, Reply, Thread } from '@/app/lib/definitions';
import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import NextImage from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PostStats from './post-stats';
import {
  ArrowPathRoundedSquareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import apiService from '@/app/lib/apiService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DeleteConfirmModal from '../modal/delete-confirm-modal';
import { transformedContent } from '../form/form-mention-textfield';
import { transformedDateAndTime } from '@/app/lib/utils';
import socket from '@/app/lib/socket';

export default function PostCard({
  post,
  chained,
  setUpdatedTarget,
  isNotifRead,
}: {
  post: Post;
  chained?: boolean;
  isNotifRead?: boolean;
  setUpdatedTarget?: Dispatch<
    SetStateAction<Post | { reply: Reply; replyCount: number } | null>
  >;
}) {
  const { data } = useSession();
  const router = useRouter();
  const [anchorEl, setAncholEl] = useState<HTMLElement | null>(null);
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  const [openModal, setOpenModal] = useState(false);
  const relationship = post?.author.relationship;
  const [isFollowed, setIsFollowed] = useState(
    relationship === 'followedByCurrentUser' ||
      relationship === 'followEachOther',
  );
  const transformedPostContent = transformedContent(post?.content);

  useEffect(() => {
    if (post?.mediaFile) {
      const img = new Image();
      img.src = post?.mediaFile;
      img.onload = () => {
        setImageSizes({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [post]);

  const handleToggleFollow = async (userId: string) => {
    setAncholEl(null);
    try {
      const response = isFollowed
        ? await apiService.delete('/follows', { data: { followeeId: userId } })
        : await apiService.post('/follows', { followeeId: userId });
      socket.emit(
        'toggleFollowNotif',
        isFollowed
          ? { ...response.data.notif, delete: true }
          : response.data.notif,
      );
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack
        onClick={() =>
          router.push(`/main/${post?.author.username}/posts/${post?._id}`)
        }
        sx={{
          width: '100%',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            // position: 'relative',
            width: '100%',
            px: 2,
            py: 1,
            borderBottom: chained
              ? ''
              : isNotifRead === false
              ? '1px solid rgba(69,68,63,0.5)'
              : '1px solid rgb(239, 243, 244)',
            bgcolor: isNotifRead === false ? 'rgba(243,241,197,0.5)' : '',
          }}
        >
          <Stack sx={{ alignItems: 'center' }}>
            <Avatar src={post?.author.avatar} alt={post?.author.username} />
            {chained && (
              <Box
                sx={{
                  position: 'relative',
                  top: 8,
                  width: 2,
                  flexGrow: 1,
                  border: '0 solid black',
                  bgcolor: 'rgb(207, 217, 222)',
                }}
              ></Box>
            )}
          </Stack>
          <Stack sx={{ flexGrow: 1, pl: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/main/${post?.author.username}`);
                  }}
                  component="span"
                  sx={{
                    pr: 1,
                    color: 'rgb(15, 20, 25)',
                    fontWeight: 'bold',
                    fontSize: 15,
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {post?.author.displayName}
                </Typography>
                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/main/${post?.author.username}`);
                  }}
                  component="span"
                  sx={{
                    color: 'rgb(83, 100, 113)',
                    fontSize: 15,
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  @{post?.author.username}
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
                  {transformedDateAndTime(post?.createdAt)}
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
            <Box sx={{ mb: 1 }}>{transformedPostContent}</Box>
            {post?.mediaFile && (
              <Box
                sx={{
                  display: 'flex',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  pb: 1,
                }}
              >
                <NextImage
                  src={post?.mediaFile}
                  alt="post-image"
                  width={imageSizes.width > 510 ? 510 : imageSizes.width}
                  height={imageSizes.height}
                />
              </Box>
            )}
            <PostStats post={post} />
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
        {data?.currentUser._id === post?.author._id ? (
          <Box>
            <MenuItem
              sx={{ fontWeight: 'bold' }}
              onClick={() => router.push(`/compose/edit/post/${post._id}`)}
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
            onClick={() => handleToggleFollow(post?.author._id)}
          >
            {isFollowed ? 'Unfollow' : 'Follow'} @{post?.author.username}
          </MenuItem>
        )}
      </Menu>
      <DeleteConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        targetType="post"
        targetId={post?._id}
        setUpdatedTarget={chained ? undefined : setUpdatedTarget}
        chainedOrDetailed={chained}
      />
    </>
  );
}
