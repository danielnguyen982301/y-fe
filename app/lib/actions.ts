'use server';

import { auth, signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import apiService from './apiService';

export async function authenticate(formData: {
  email: string;
  password: string;
}) {
  await signIn('credentials', formData);
}

export async function getSession() {
  const session = await auth();
  return session;
}

export async function logOut() {
  await signOut({ redirectTo: '/login' });
}

export async function getHashtags() {
  try {
    const response = await apiService.get('/hashtags');
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
