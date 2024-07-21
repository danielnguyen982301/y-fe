'use client';

import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import NextImage from 'next/image';
import React, { useEffect, useState } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Post } from '@/app/lib/definitions';
import PostStats from './post-stats';
import apiService from '@/app/lib/apiService';
import { transformedContent } from '../form/form-mention-textfield';
import DeleteConfirmModal from '../modal/delete-confirm-modal';
import socket from '@/app/lib/socket';

export default function PostDetails({
  post,
  newReplyCount,
}: {
  post: Post;
  newReplyCount?: number;
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

  const postDate = new Date(post?.createdAt);

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
    } catch (error) {}
  };

  return (
    <>
      <Stack sx={{ width: '100%' }}>
        <Stack
          sx={{
            width: '100%',
            p: 1,
          }}
        >
          <Box sx={{ display: 'flex', width: '100%', p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Avatar src={post?.author.avatar} alt={post?.author.username} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexGrow: 1,
                pl: 1,
              }}
            >
              <Stack>
                <Box>
                  <Typography
                    sx={{
                      color: 'rgb(15, 20, 25)',
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    {post?.author.displayName}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgb(83, 100, 113)', fontSize: 15 }}>
                    @{post?.author.username}
                  </Typography>
                </Box>
              </Stack>
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
          </Box>
          <Stack sx={{ flexGrow: 1, px: 1, pb: 1 }}>
            <Box sx={{ py: 1 }}>{transformedPostContent}</Box>
            {post?.mediaFile && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
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
            <Box sx={{ display: 'flex' }}>
              <Typography sx={{ color: 'rgb(83, 100, 113)', fontSize: 15 }}>
                {postDate.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: 'rgb(83, 100, 113)',
                  '&::before': {
                    content: `"•"`,
                    mx: 1,
                  },
                }}
              >
                {postDate.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: 'rgb(83, 100, 113)',
                  '&::before': {
                    content: `"•"`,
                    mx: 1,
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: 'bold', color: 'black' }}
                >
                  {post?.viewCount}
                </Typography>{' '}
                Views
              </Typography>
            </Box>
            <PostStats post={post} newReplyCount={newReplyCount} detailed />
          </Stack>
        </Stack>
      </Stack>
      <Menu
        id="menu-appbar"
        onClick={() => setAncholEl(null)}
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
          <MenuItem onClick={() => handleToggleFollow(post?.author._id)}>
            {isFollowed ? 'Unfollow' : 'Follow'} @{post?.author.username}
          </MenuItem>
        )}
      </Menu>
      <DeleteConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        targetType="post"
        targetId={post?._id}
        chainedOrDetailed
      />
    </>
  );
}
