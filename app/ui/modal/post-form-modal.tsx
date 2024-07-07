'use client';

import { Box, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PostForm from '../post/post-form';
import { usePathname, useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Post, Reply } from '@/app/lib/definitions';

const style = {
  position: 'absolute' as 'absolute',
  top: '10%',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  py: 1,
};

export default function PostFormModal({
  postModal,
  editTargetType,
  editTarget,
}: {
  postModal?: boolean;
  editTargetType?: 'Post' | 'Reply';
  editTarget?: Post | Reply;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!pathname.includes('compose')) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          router.back();
        }}
      >
        <Box sx={style}>
          <Box
            sx={{
              width: 30,
              height: 30,
              ml: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(15,20,25,0.1)', borderRadius: 9999 },
            }}
            onClick={() => router.back()}
          >
            <XMarkIcon width={30} height={30} />
          </Box>
          <PostForm
            postModal={postModal}
            editTargetType={editTargetType}
            editTarget={editTarget}
          />
        </Box>
      </Modal>
    </>
  );
}
