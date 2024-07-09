'use client';

import { Box, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PostForm from '../post/post-form';
import { usePathname, useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Post, Reply } from '@/app/lib/definitions';
import UserProfileSetupForm from '../user/user-profile-update-form';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 650,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  py: 1,
};

export default function UpdateProfileModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!pathname.includes('settings')) {
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
          <UserProfileSetupForm />
        </Box>
      </Modal>
    </>
  );
}
