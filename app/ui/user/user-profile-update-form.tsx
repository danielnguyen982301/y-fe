import { useSession } from 'next-auth/react';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FormProvider from '../form/form-provider';
import Image from 'next/image';
import FTextField from '../form/form-textfield';
import { useRouter } from 'next/navigation';
import apiService from '@/app/lib/apiService';
import { isEqual } from 'lodash';
import { cloudinaryUpload } from '@/app/lib/utils';

const yupSchema = Yup.object().shape({
  displayName: Yup.string().required('Display Name is required'),
  bio: Yup.string().optional(),
  location: Yup.string().optional(),
});

type ImageFileWithPreview = File & { preview: string };

type ProfileUpdateData = {
  avatar?: ImageFileWithPreview | string | null;
  header?: ImageFileWithPreview | string | null;
  displayName: string;
  bio?: string;
  location?: string;
};

export default function UserProfileUpdateForm() {
  const { data, update } = useSession();
  const router = useRouter();
  const defaultValues: ProfileUpdateData = {
    avatar: data?.currentUser.avatar ?? null,
    header: data?.currentUser.avatar ?? null,
    displayName: data?.currentUser.displayName as string,
    bio: data?.currentUser.bio ?? '',
    location: data?.currentUser.bio ?? '',
  };
  const methods = useForm<ProfileUpdateData>({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const { handleSubmit, resetField, setValue, watch } = methods;

  const updateData = watch();
  const { avatar, header, displayName, location, bio } = updateData;
  const initialUserData = {
    displayName: data?.currentUser.displayName,
    avatar: data?.currentUser.avatar,
    header: data?.currentUser.header,
    bio: data?.currentUser.bio,
    location: data?.currentUser.location,
  };
  const isDataDifferent = !isEqual(updateData, initialUserData);

  const avatarDropzone = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          setValue(
            'avatar',
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          );
        }
      },
      [setValue],
    ),
  });

  const headerDropzone = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          setValue(
            'header',
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          );
        }
      },
      [setValue],
    ),
  });

  const onSubmit = async ({
    avatar,
    header,
    ...updateDetails
  }: ProfileUpdateData) => {
    let avatarData, headerData;
    if (avatar && typeof avatar === 'object') {
      avatarData = await cloudinaryUpload(avatar as File);
    }
    if (header && typeof header === 'object') {
      headerData = await cloudinaryUpload(header as File);
    }
    try {
      await apiService.put(`/users/${data?.currentUser._id}`, {
        ...updateDetails,
        avatar: avatarData,
        header: headerData,
      });
      await update({
        currentUser: {
          ...data?.currentUser,
          ...{ ...updateDetails, avatar: avatarData, header: headerData },
        },
      });
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue('displayName', data?.currentUser.displayName as string);
    setValue('avatar', data?.currentUser.avatar);
    setValue('header', data?.currentUser.header);
    setValue('bio', data?.currentUser.bio);
    setValue('location', data?.currentUser.location);
  }, [data, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, px: 1.5 }}>
          <Box
            onClick={() => router.back()}
            sx={{
              mr: 3,
              width: 30,
              height: 30,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(15,20,25,0.1)', borderRadius: 9999 },
            }}
          >
            <XMarkIcon width={30} height={30} />
          </Box>
          <Box sx={{ flexGrow: 1, fontWeight: 'bold' }}>Edit Profile</Box>
          <Box>
            <Button
              variant="contained"
              type="submit"
              disabled={!isDataDifferent}
            >
              Save
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: 200, width: '100%', position: 'relative' }}>
          <Box
            sx={{
              width: '100%',
              height: '200px',
              backgroundColor: header ? '' : 'rgb(207, 217, 222)',
            }}
          >
            {header && (
              <Image
                src={
                  (header as ImageFileWithPreview)?.preview ??
                  (header as string)
                }
                alt={'user-header'}
                fill
              />
            )}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              zIndex: 10,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            <Box
              {...headerDropzone.getRootProps({ className: 'dropzone' })}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                bgcolor: 'rgb(15 20 25 / 75%)',
                color: 'white',
                borderRadius: 9999,
                '&:hover': { bgcolor: 'rgba(39,44,48,0.75)' },
              }}
            >
              <input {...headerDropzone.getInputProps()} />
              <CameraIcon width={20} height={20} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              transform: 'translateY(-50%)',
              left: 15,
            }}
          >
            <Box position="relative">
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 10,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                }}
              >
                <Box
                  {...avatarDropzone.getRootProps({ className: 'dropzone' })}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    bgcolor: 'rgb(15 20 25 / 75%)',
                    color: 'white',
                    borderRadius: 9999,
                    '&:hover': { bgcolor: 'rgba(39,44,48,0.75)' },
                  }}
                >
                  <input {...avatarDropzone.getInputProps()} />
                  <CameraIcon width={20} height={20} />
                </Box>
              </Box>
              <Avatar
                sx={{ width: 120, height: 120, border: '4px solid white' }}
                src={
                  (avatar as ImageFileWithPreview)?.preview ??
                  (avatar as string)
                }
                alt={'user-avatar'}
              />
            </Box>
          </Box>
        </Box>
        <Stack spacing={3} sx={{ px: 1.5, mt: 9 }}>
          <FTextField name="displayName" label="Name" />
          <FTextField name="bio" label="Bio" multiline rows={4} />
          <FTextField name="location" label="Location" />
        </Stack>
      </Stack>
    </FormProvider>
  );
}
