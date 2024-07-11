'use client';

import React, { useState } from 'react';
import {
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Link from 'next/link';
import FormProvider from '@/app/ui/form/form-provider';
import FTextField from '@/app/ui/form/form-textfield';
import FCheckbox from '@/app/ui/form/form-checkbox';
import { authenticate } from '@/app/lib/actions';
import socket from '@/app/lib/socket';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

type LoginData = {
  email: string;
  password: string;
  remember?: boolean;
};

const defaultValues: LoginData = {
  email: '',
  password: '',
  remember: true,
};

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginData>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginData) => {
    let { email, password } = data;

    try {
      await authenticate({ email, password });
      // socket.auth = { username: user.username };
      // socket.connect();
    } catch (error) {
      reset();
      setError('root.responseError', {
        message: 'Either email or password is incorrect',
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.root?.responseError && (
            <Alert severity="error">{errors.root.responseError.message}</Alert>
          )}
          <Alert severity="info">
            Don’t have an account? <Link href="/register">Get started</Link>
          </Alert>

          <FTextField name="email" label="Email address" />

          <FTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FCheckbox name="remember" label="Remember me" />
          <Link href="/">Forgot password?</Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}
