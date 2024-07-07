'use client';

import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PostForm from '../post/post-form';
import { usePathname, useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/20/solid';
import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  py: 2,
  px: 2,
};

export default function DeleteConfirmModal({
  open,
  setOpen,
  targetType,
  targetId,
  setUpdatedTarget,
  chainedOrDetailed,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  targetType: 'post' | 'reply';
  targetId: string;
  setUpdatedTarget?: Dispatch<
    SetStateAction<Post | { reply: Reply; replyCount: number } | null>
  >;
  chainedOrDetailed?: boolean;
}) {
  const router = useRouter();
  const handleDelete = async (targetId: string) => {
    try {
      const response = await apiService.delete(
        `/${targetType === 'post' ? 'posts' : 'replies'}/original/${targetId}`,
      );
      if (setUpdatedTarget) {
        setUpdatedTarget(response.data);
      }
      if (chainedOrDetailed) {
        router.push('/main/home');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Stack>
            <Box>
              Are you sure you want to{' '}
              <Typography sx={{ fontWeight: 'bold' }} component="span">
                delete
              </Typography>{' '}
              this {targetType} ?
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box>
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'red' }}
                  onClick={() => handleDelete(targetId)}
                >
                  Delete
                </Button>
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
