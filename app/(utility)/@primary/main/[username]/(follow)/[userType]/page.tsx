'use client';

import apiService from '@/app/lib/apiService';
import { User } from '@/app/lib/definitions';
import UserList from '@/app/ui/user/user-list';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function Page({
  params,
}: {
  params: { username: string; userType: string };
}) {
  const { username, userType } = params;
  const tab = userType.charAt(0).toUpperCase() + userType.substring(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const response = await apiService.get(`/users/${username}`);
        setSelectedUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleUser();
  }, [username]);

  return <UserList tab={tab} selectedUser={selectedUser as User} />;
}
