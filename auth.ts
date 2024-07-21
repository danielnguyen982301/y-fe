import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import apiService from './app/lib/apiService';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const response = await apiService.post('/auth/login', {
          email: credentials.email,
          password: credentials.password,
        });
        const { user, accessToken } = response.data;
        if (!user) return null;
        return { ...user, accessToken };
      },
    }),
  ],
});
