'use client';

import { useUserData } from '@/app/lib/hooks';
import { Avatar, Box, Button, Stack } from '@mui/material';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import * as Yup from 'yup';
import FormProvider from '../form/form-provider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import MentionTextField from '../form/form-mention-textfield';
import Image from 'next/image';
import { CameraIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Hashtag, Post, Reply, Thread } from '@/app/lib/definitions';
import apiService from '@/app/lib/apiService';
import { cloudinaryUpload } from '@/app/lib/utils';
import { useSession } from 'next-auth/react';

const yupSchema = Yup.object().shape({
  content: Yup.string().required('Content is required'),
});

type PostFormData = {
  content: string;
  mediaFile?: (File & { preview?: string }) | null;
};

const defaultValues: PostFormData = {
  content: '',
  mediaFile: null,
};

export default function PostForm({
  setNewPost,
  setNewReply,
  targetType,
  targetId,
}: {
  setNewPost?: Dispatch<SetStateAction<Thread | null>>;
  setNewReply?: Dispatch<
    SetStateAction<{ reply: Reply; replyCount: number } | null>
  >;
  targetType?: 'Post' | 'Reply';
  targetId?: string;
}) {
  const { data } = useSession();

  const methods = useForm<PostFormData>({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          setValue(
            'mediaFile',
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          );
        }
      },
      [setValue],
    ),
  });

  const { mediaFile, content } = watch();

  const onSubmit = async (data: PostFormData) => {
    let { content } = data;
    const regex = /#\[(\w+)\]|#(\w+)/gm;
    let result;
    const tagNames = [];
    while ((result = regex.exec(content)) !== null) {
      const [, existingTag, newTag] = result;
      if (existingTag) tagNames.push(existingTag);
      if (newTag) tagNames.push(newTag);
    }

    const transformedContent = content.replace(
      /#\[(\w+)\]/gm,
      (match, p1) => `#${p1}`,
    );

    try {
      const bodyData: {
        content: string;
        mediaFile?: File;
        targetType?: 'Post' | 'Reply';
        targetId?: string;
      } = {
        content: transformedContent,
      };
      if (mediaFile) bodyData.mediaFile = await cloudinaryUpload(mediaFile);
      if (setNewPost) {
        const postResponse = await apiService.post('/posts', bodyData);
        await apiService.post('/hashtags', {
          hashtags: tagNames,
          postId: postResponse.data.post._id,
        });
        setNewPost(postResponse.data);
      }
      if (setNewReply) {
        const response = await apiService.post('/replies', {
          ...bodyData,
          targetType,
          targetId,
        });
        setNewReply(response.data);
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        px: '16px',
        borderBottom: '1px solid rgb(239, 243, 244)',
      }}
    >
      <Box sx={{ pt: '12px' }}>
        <Avatar
          src={data?.currentUser?.avatar}
          alt={data?.currentUser?.username}
        />
      </Box>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        style={{ flexGrow: 1, width: 'calc(100% - 40px)' }}
      >
        <Stack sx={{ pt: '20px', pl: '8px' }}>
          <Box>
            <MentionTextField name="content" inputValue={content} />
          </Box>
          <Box sx={{ borderBottom: '1px solid rgb(239, 243, 244)', mt: 3 }}>
            {mediaFile && mediaFile.preview && (
              <Box
                sx={{ position: 'relative', width: '100px', height: '100px' }}
              >
                <XCircleIcon
                  onClick={() => setValue('mediaFile', null)}
                  className="absolute -right-2 -top-2 h-5 w-5 cursor-pointer"
                />
                <Image
                  src={mediaFile.preview}
                  alt="image-preview"
                  width={100}
                  height={100}
                  style={{
                    border: '1px solid lightgrey',
                    width: '100px',
                    height: '100px',
                  }}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              pb: 2,
            }}
          >
            <Box
              {...getRootProps({ className: 'dropzone' })}
              sx={{ width: '20px', height: '20px', cursor: 'pointer' }}
            >
              <input {...getInputProps()} />
              <CameraIcon />
            </Box>
            <Box>
              <Button variant="contained" type="submit" disabled={!content}>
                Post
              </Button>
            </Box>
          </Box>
        </Stack>
      </FormProvider>
    </Box>
  );
}
