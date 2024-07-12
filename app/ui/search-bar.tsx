'use client';

import { XCircleIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Box, Menu, MenuItem, TextField, Typography } from '@mui/material';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { ChatUser, Hashtag, User } from '../lib/definitions';
import apiService from '../lib/apiService';
import TagSuggestionCard from './suggestions/tag-suggestion-card';
import UserSuggestionCard from './suggestions/user-suggestion-card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBar({
  query,
  chatUserSearch,
  handleSelectChatUser,
}: {
  query?: string;
  chatUserSearch?: boolean;
  handleSelectChatUser?: (user: User) => void;
}) {
  const [anchorEl, setAncholEl] = useState<HTMLElement | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<Hashtag[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [searchText, setSearchText] = useState(query ?? '');
  const router = useRouter();
  const noResultFound =
    (!tagSuggestions.length && searchText?.includes('#')) ||
    (!userSuggestions.length && searchText?.includes('@'));

  const handleSearchChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const searchContent = event.target.value;
    setSearchText(searchContent);
    const regex = /(#\w+|#)|(@\w+|@)/g;
    const queries = [];
    let match;
    while ((match = regex.exec(searchContent)) !== null) {
      const [, tagSearch, userSearch] = match;
      if (tagSearch) queries.push(tagSearch);
      if (userSearch) queries.push(userSearch);
    }

    if (!queries.length && !chatUserSearch) {
      setTagSuggestions([]);
      setUserSuggestions([]);
      setAncholEl(null);
      return;
    }
    const lastQuery = queries.pop();
    try {
      if (lastQuery?.startsWith('#')) {
        if (chatUserSearch) return;
        setUserSuggestions([]);
        const tagResponse = await apiService.get('/hashtags', {
          params: { searchText: lastQuery.slice(1) },
        });
        setTagSuggestions(tagResponse.data.hashtags);
        setAncholEl(event.target);
      } else {
        setTagSuggestions([]);
        const userResponse = await apiService.get('/users', {
          params: { searchText: lastQuery?.slice(1) || searchContent },
        });
        setUserSuggestions(userResponse.data.users);
        setAncholEl(event.target);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (chatUserSearch) return;
    event.preventDefault();
    setAncholEl(null);
    const transformedSearch = searchText?.replace(/#|@/g, '');
    if (!transformedSearch) return;
    router.push(`/main/explore?q=${transformedSearch}`);
  };

  const redirectToUserProfile = (username: string) => {
    router.push(`/main/${username}`);
  };

  // const handleSelectChatUser = (user: User) => {
  //   if (setSelectedChatUser && setChatUsers && chatUsers) {
  //     const existingChatUser = chatUsers.find(
  //       ({ userId }) => userId === user._id,
  //     );
  //     if (existingChatUser) {
  //       setSelectedChatUser(existingChatUser);
  //     } else {
  //       const chatUser: ChatUser = {
  //         ...user,
  //         messages: [],
  //       };
  //       setChatUsers([chatUser, ...chatUsers]);
  //       setSelectedChatUser(chatUser);
  //     }
  //   }
  // };

  useEffect(() => {
    if (query) {
      setSearchText(query);
    }
  }, [query]);

  return (
    <form style={{ width: '350px' }} onSubmit={handleSearchSubmit}>
      <TextField
        autoComplete="off"
        value={searchText}
        placeholder="Search"
        onChange={handleSearchChange}
        sx={{
          border: 'none',
          width: '100%',
          '& fieldset': {
            borderRadius: '9999px',
            background: `rgb(239, 243, 244)`,
            zIndex: -1,
          },
        }}
        size="medium"
        InputProps={{
          startAdornment: (
            <MagnifyingGlassIcon
              style={{ width: '20px', height: '20px', marginRight: '15px' }}
            />
          ),
          endAdornment: (
            <XCircleIcon style={{ width: '20px', height: '20px' }} />
          ),
        }}
      />
      <Menu
        sx={{ mt: '40px' }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableAutoFocus
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl) && !!searchText}
        onClose={() => setAncholEl(null)}
      >
        <Box sx={{ width: 350 }}>
          {noResultFound && (
            <Typography sx={{ p: 2 }}>Search for {searchText}</Typography>
          )}
          {!!tagSuggestions.length &&
            tagSuggestions.map((tag) => (
              <MenuItem
                sx={{ width: '100%' }}
                key={tag._id}
                onClick={() => {
                  router.push(
                    `/main/explore?q=${encodeURIComponent(`#${tag.name}`)}`,
                  );
                  setAncholEl(null);
                }}
              >
                {/* <Link href={`/explore?q=${encodeURIComponent(`#${tag.name}`)}`}> */}
                <TagSuggestionCard tag={tag} />
                {/* </Link> */}
              </MenuItem>
            ))}
          {!!userSuggestions.length &&
            userSuggestions.map((user) => (
              <MenuItem
                sx={{ width: '100%' }}
                key={user._id}
                onClick={() => {
                  if (chatUserSearch && handleSelectChatUser) {
                    handleSelectChatUser(user);
                    setSearchText('');
                  } else redirectToUserProfile(user.username);
                  setAncholEl(null);
                }}
              >
                <UserSuggestionCard user={user} />
              </MenuItem>
            ))}
        </Box>
      </Menu>
    </form>
  );
}
