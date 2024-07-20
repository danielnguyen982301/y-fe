'use client';

import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { User } from '@/app/lib/definitions';
import LoadingScreen from '@/app/ui/loading-screen';
import UserList from '@/app/ui/user/user-list';

export default function Page({
  params,
}: {
  params: { username: string; userType: string };
}) {
  const { username, userType } = params;
  const tab = userType.charAt(0).toUpperCase() + userType.substring(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const getSingleUser = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/users/${username}`);
        setSelectedUser(response.data);
        setLoading(false);
      } catch (error) {}
    };
    getSingleUser();
  }, [username]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <UserList tab={tab} selectedUser={selectedUser as User} />
  );
}
