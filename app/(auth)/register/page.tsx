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
import apiService from '@/app/lib/apiService';
import { signIn } from '@/auth';
import FormProvider from '@/app/ui/form/form-provider';
import FTextField from '@/app/ui/form/form-textfield';
import Link from 'next/link';
import { authenticate } from '@/app/lib/actions';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  displayName: Yup.string().required('Display Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

type RegisterData = {
  username: string;
  displayName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const defaultValues: RegisterData = {
  username: '',
  displayName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const methods = useForm<RegisterData>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterData) => {
    const { username, displayName, email, password } = data;
    try {
      await apiService.post('/users', {
        username,
        displayName,
        email,
        password,
      });
      await authenticate({ email, password });
    } catch (error) {
      console.log(error);
      reset();
      setError('root.responseError', error as Error);
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
            Already have an account? <Link href="/login">Sign in</Link>
          </Alert>

          <FTextField name="username" label="Username" />
          <FTextField name="displayName" label="Display Name" />
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
          <FTextField
            name="passwordConfirmation"
            label="Password Confirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                    edge="end"
                  >
                    {showPasswordConfirmation ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}
