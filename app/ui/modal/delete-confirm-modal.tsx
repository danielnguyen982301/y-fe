'use client';

import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import socket from '@/app/lib/socket';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 400 },
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
  const [loading, setLoading] = useState(false);

  const handleDelete = async (targetId: string) => {
    setLoading(true);
    try {
      const response = await apiService.delete(
        `/${targetType === 'post' ? 'posts' : 'replies'}/original/${targetId}`,
      );
      setLoading(false);
      toast.success(`Deleted ${targetType} Successfully`);
      socket.emit('deleteNotif', response.data.notifRecipients);
      if (setUpdatedTarget) {
        if (targetType === 'post') {
          setUpdatedTarget(response.data.post);
        } else {
          delete response.data.notifRecipients;
          setUpdatedTarget(response.data);
        }
      }
      if (chainedOrDetailed) {
        router.push('/main/home');
      }
    } catch (error) {
      toast.error('Something went wrong');
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
            <Box sx={{ textAlign: 'center' }}>
              Are you sure you want to{' '}
              <Typography sx={{ fontWeight: 'bold' }} component="span">
                delete
              </Typography>{' '}
              this {targetType} ?
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Box>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    bgcolor: 'rgb(244,33,46)',
                    mr: 2,
                    fontWeight: 'bold',
                    borderRadius: 9999,
                    '&:hover': { bgcolor: 'rgb(220,30,41)' },
                  }}
                  onClick={() => handleDelete(targetId)}
                >
                  Delete
                </LoadingButton>
                <Button
                  sx={{
                    textTransform: 'none',
                    bgcolor: 'white',
                    color: 'black',
                    border: '1px solid rgb(207,217,222)',
                    mr: 2,
                    fontWeight: 'bold',
                    borderRadius: 9999,
                    '&:hover': { bgcolor: 'rgba(15,20,25,0.1)' },
                  }}
                  variant="contained"
                  onClick={() => setOpen(false)}
                >
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
