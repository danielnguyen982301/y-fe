import type { NextAuthConfig } from 'next-auth';
import 'next-auth/jwt';

import { isValidToken } from './app/lib/utils';
import { User as CurrentUser } from './app/lib/definitions';

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    currentUser: Omit<CurrentUser, 'accessToken'>;
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    currentUser: Omit<CurrentUser, 'accessToken'>;
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
        nextUrl.pathname.startsWith('/main') ||
        nextUrl.pathname.startsWith('/compose') ||
        nextUrl.pathname.startsWith('/settings');
      if (
        nextUrl.pathname === '/' ||
        (nextUrl.pathname === '/main' && isLoggedIn)
      )
        return Response.redirect(new URL('/main/home', nextUrl));
      if (isOnMainRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/main/home', nextUrl));
      }
      return true;
    },
    async jwt({ token, user, session, trigger }) {
      if (user) {
        const currentUser = { ...user } as Omit<CurrentUser, 'accessToken'>;
        delete currentUser.accessToken;
        token.accessToken = user.accessToken;
        token.currentUser = currentUser;
      }
      if (trigger === 'update' && session?.currentUser) {
        token.currentUser = session.currentUser;
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
  providers: [],
} satisfies NextAuthConfig;
