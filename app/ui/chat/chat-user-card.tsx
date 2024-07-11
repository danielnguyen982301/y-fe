'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ArrowPathRoundedSquareIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useUserData } from '@/app/lib/hooks';
import Link from 'next/link';
import apiService from '@/app/lib/apiService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChatUser } from '@/app/lib/definitions';
import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';

export default function ChatUserCard({
  chatUser,
  setSelectedChatUser,
}: {
  chatUser: ChatUser;
  setSelectedChatUser: Dispatch<SetStateAction<ChatUser | null>>;
}) {
  const { data } = useSession();
  const router = useRouter();
  const [anchorEl, setAncholEl] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Stack
        onClick={() => setSelectedChatUser(chatUser)}
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
          }}
        >
          <Stack sx={{ alignItems: 'center' }}>
            <Avatar src={''} alt={''} />
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
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  user {chatUser.userId}
                </Typography>
                <Typography
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
                  @{chatUser.username}
                </Typography>
                {/* <Typography
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
                  {postTime}
                </Typography> */}
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
          </Stack>
        </Box>
      </Stack>
      {/* <Menu
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
      </Menu> */}
    </>
  );
}
