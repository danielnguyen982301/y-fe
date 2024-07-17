'use client';

import apiService from '@/app/lib/apiService';
import { Follow, User } from '@/app/lib/definitions';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import UserCard from './user-card';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

        if (response) {
          setTotalPages(response.data.totalPages);
          const axiosResponse = response;
          currentPage === 1
            ? setUsers(response.data.users)
            : setUsers((prevState) => [
                ...prevState,
                ...axiosResponse?.data.users,
              ]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [query, tab, selectedUser, currentPage]);

  return (
    <Stack>
      {!!users.length && (
        <InfiniteScroll
          dataLength={users.length}
          next={() => setCurrentPage(currentPage + 1)}
          hasMore={users.length >= 10 && currentPage < totalPages}
          loader={<h4>Loading...</h4>}
        >
          {users.map((user) => (
            <UserCard key={user?._id} user={user} />
          ))}
        </InfiniteScroll>
      )}
    </Stack>
  );
}
