'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';
import apiService from './lib/apiService';
import { getSession, logOut } from './lib/actions';
import { isValidToken } from './lib/utils';
import { User } from './lib/definitions';
import { useSession } from 'next-auth/react';

export const UserContext = createContext<{ user: User | null }>(null!);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !isValidToken(session.accessToken)) {
      delete apiService.defaults.headers.common.Authorization;
      return;
    }
    apiService.defaults.headers.common.Authorization = `Bearer ${session.accessToken}`;
    // if (!session) return;
    const fetchUserData = async () => {
      try {
        const response = await apiService.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [session]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
