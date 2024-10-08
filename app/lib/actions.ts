'use server';

import { auth, signIn, signOut } from '@/auth';

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
