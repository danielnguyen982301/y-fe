import type { DefaultSession, NextAuthConfig, Session } from 'next-auth';
import jwt from 'jsonwebtoken';
import 'next-auth/jwt';
import { isValidToken } from './app/lib/utils';
import { signOut } from 'next-auth/react';
import { User as CurrentUser } from './app/lib/definitions';
import { omit } from 'lodash';

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    currentUser: CurrentUser;
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    currentUser: CurrentUser;
  }
  interface User {
    accessToken: string;
  }
}

export type CustomJwtPayload = { _id: string };

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.accessToken && isValidToken(auth.accessToken);
      const isOnMainRoute =
        nextUrl.pathname.startsWith('/') &&
        nextUrl.pathname !== '/login' &&
        nextUrl.pathname !== '/register';
      if (nextUrl.pathname === '/' && isLoggedIn)
        return Response.redirect(new URL('/home', nextUrl));
      if (isOnMainRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/home', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.currentUser = { ...(omit(user, 'accessToken') as CurrentUser) };
        // const userFields = Object.keys(user);
        // userFields.forEach((field) => {token[field] = user[field as keyof typeof user]})
        // token.accessToken = user.accessToken;

        // const payload: CustomJwtPayload = jwt.decode(
        //   user.accessToken as string,
        // ) as CustomJwtPayload;
        // token.userId = payload._id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.currentUser = token.currentUser;
      }
      return session;
    },
  },
  session: {
    maxAge: 24 * 60 * 60,
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
