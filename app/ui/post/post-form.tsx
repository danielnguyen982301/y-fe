'use client';

import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
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
import { useRouter } from 'next/navigation';
import { isEqual } from 'lodash';
import socket from '@/app/lib/socket';

const yupSchema = Yup.object().shape({
  content: Yup.string().required('Content is required'),
});

type MediaFileWithPreview = File & { preview: string };

type PostFormData = {
  content: string;
  mediaFile?: MediaFileWithPreview | string | null;
};

export default function PostForm({
  setNewPost,
  setNewReply,
  replyTargetType,
  replyTarget,
  editTargetType,
  editTarget,
  postModal,
}: {
  setNewPost?: Dispatch<SetStateAction<Thread | null>>;
  setNewReply?: Dispatch<
    SetStateAction<{ reply: Reply; replyCount: number } | null>
  >;
  replyTargetType?: 'Post' | 'Reply';
  replyTarget?: Post | Reply;
  editTargetType?: 'Post' | 'Reply';
  editTarget?: Post | Reply;
  postModal?: boolean;
}) {
  const { data } = useSession();
  const router = useRouter();

  const defaultValues: PostFormData = {
    content: '',
    mediaFile: null,
  };

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

  useEffect(() => {
    setValue('content', editTarget?.content as string);
    setValue('mediaFile', editTarget?.mediaFile);
  }, [editTarget, setValue]);

  const formData = watch();
  const { mediaFile, content } = formData;
  const initialTargetContent = {
    content: editTarget?.content,
    mediaFile: editTarget?.mediaFile,
  };
  const isEditedContentDifferent = !isEqual(initialTargetContent, formData);
  const isReply = replyTarget || (editTarget && editTargetType === 'Reply');

  const onSubmit = async (formData: PostFormData) => {
    let { content } = formData;
    const regex = /#\[(\w+)\]|#(\w+)|@\((\w+)\)\[([\s\w\-]+)\]/gm;
    let result;
    const tagNames = [];
    const mentionedTargets = [];
    while ((result = regex.exec(content)) !== null) {
      const [, existingTag, newTag, mentionedUser] = result;
      if (existingTag) tagNames.push(existingTag);
      if (newTag) tagNames.push(newTag);
      if (mentionedUser) mentionedTargets.push(mentionedUser);
    }

    const transformedContent = content.replace(
      /#\[(\w+)\]|@\(\w+\)\[([\s\w\-]+)\]/gm,
      (match, p1, p2) => (p1 ? `#${p1}` : `@${p2.split('-')[1]}`),
    );

    let response;
    try {
      const bodyData: {
        content: string;
        mediaFile?: File;
        targetType?: 'Post' | 'Reply';
        targetId?: string;
        links?: string[];
      } = {
        content: transformedContent,
      };
      if (mediaFile && typeof mediaFile === 'object')
        bodyData.mediaFile = await cloudinaryUpload(mediaFile as File);

      if (setNewPost || postModal) {
        response = await apiService.post('/posts', bodyData);
        if (setNewPost) {
          setNewPost(response.data);
        }
        if (tagNames.length) {
          await apiService.post('/hashtags', {
            hashtags: tagNames,
            postId: response.data.post._id,
          });
        }
        if (mentionedTargets.length) {
          const actualTargets = mentionedTargets.filter(
            (target) => target !== data?.currentUser._id,
          );
          await apiService.post('/notifications/mentions', {
            mentionedTargets: actualTargets,
            mentionLocationType: 'Post',
            mentionLocation: response.data.post._id,
          });
          socket.emit('mentionNotif', actualTargets);
        }
        if (postModal) {
          router.push('/main/home');
        }
      }

      if (setNewReply) {
        bodyData.targetType = replyTargetType;
        bodyData.targetId = replyTarget?._id;
        bodyData.links =
          replyTargetType === 'Post'
            ? [replyTarget?._id as string]
            : [
                ...((replyTarget as Reply).links as string[]),
                replyTarget?._id as string,
              ];
        response = await apiService.post('/replies', bodyData);
        setNewReply(response.data);
        socket.emit('replyNotif', replyTarget?.author._id);
        if (mentionedTargets.length) {
          const actualTargets = mentionedTargets.filter(
            (target) => target !== data?.currentUser._id,
          );
          await apiService.post('/notifications/mentions', {
            mentionedTargets: actualTargets,
            mentionLocationType: 'Reply',
            mentionLocation: response.data.reply._id,
          });
          socket.emit('mentionNotif', actualTargets);
        }
      }

      if (editTargetType && editTarget) {
        await apiService.put(
          `/${editTargetType === 'Post' ? 'posts' : 'replies'}/original/${
            editTarget._id
          }`,
          bodyData,
        );
        if (editTargetType === 'Post') {
          await apiService.post('/hashtags', {
            hashtags: tagNames,
            postId: editTarget._id,
          });
        }
        router.back();
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        px: 2,
        borderBottom:
          postModal || !!editTarget ? '' : '1px solid rgb(239, 243, 244)',
      }}
    >
      {isReply && (
        <Box sx={{ ml: 6 }}>
          <Typography>
            Replying to{' '}
            <Typography sx={{ color: 'rgb(29, 155, 240)' }} component="span">
              @
              {replyTarget?.author.username ||
                ((editTarget as Reply).links as (Post | Reply)[]).slice(-2)[0]
                  .author.username}
            </Typography>
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          // px: '16px',
          // borderBottom: '1px solid rgb(239, 243, 244)',
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
              <MentionTextField
                name="content"
                inputValue={content}
                formType={setNewReply ? 'Reply' : 'Post'}
              />
            </Box>
            <Box sx={{ borderBottom: '1px solid rgb(239, 243, 244)', mt: 3 }}>
              {mediaFile && (
                <Box
                  sx={{ position: 'relative', width: '100px', height: '100px' }}
                >
                  <XCircleIcon
                    onClick={() => setValue('mediaFile', null)}
                    className="absolute -right-2 -top-2 h-5 w-5 cursor-pointer"
                  />
                  <Image
                    src={
                      typeof mediaFile === 'string'
                        ? mediaFile
                        : mediaFile.preview
                    }
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
                {editTarget && editTargetType ? (
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isEditedContentDifferent}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button variant="contained" type="submit" disabled={!content}>
                    {setNewReply ? 'Reply' : 'Post'}
                  </Button>
                )}
              </Box>
            </Box>
          </Stack>
        </FormProvider>
      </Box>
    </Stack>
  );
}
