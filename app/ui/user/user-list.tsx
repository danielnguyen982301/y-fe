'use client';

import apiService from '@/app/lib/apiService';
import { Follow, User } from '@/app/lib/definitions';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import UserCard from './user-card';

export default function UserList({
  query,
  selectedUser,
  tab,
}: {
  query?: string;
  tab: string;
  selectedUser?: User;
}) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      let response;
      try {
        if (tab === 'People' && !query?.startsWith('#')) {
          response = await apiService.get('/users', {
            params: { searchText: query },
          });
        }
        if (tab === 'Followers' && selectedUser) {
          response = await apiService.get(
            `/follows/${selectedUser?._id}/followers`,
          );
        }
        if (tab === 'Following' && selectedUser) {
          response = await apiService.get(
            `/follows/${selectedUser?._id}/followees`,
          );
        }

        if (response) setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [query, tab, selectedUser]);

  return (
    <Stack>
      {!!users.length &&
        users.map((user) => <UserCard key={user?._id} user={user} />)}
    </Stack>
  );
}
