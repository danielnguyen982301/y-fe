'use client';

import { useContext } from 'react';
import { UserContext } from '../UserProvider';

export const useUserData = () => {
  return useContext(UserContext);
};
