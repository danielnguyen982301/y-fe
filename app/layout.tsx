import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import UserProvider from './UserProvider';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {/* <UserProvider> */}
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          {/* </UserProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}
