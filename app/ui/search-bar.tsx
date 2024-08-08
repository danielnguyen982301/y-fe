'use client';

import { XCircleIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Box, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { Hashtag, User } from '../lib/definitions';
import apiService from '../lib/apiService';
import TagSuggestionCard from './suggestions/tag-suggestion-card';
import UserSuggestionCard from './suggestions/user-suggestion-card';

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
    } catch (error) {}
  };

  const debounced = useDebouncedCallback((e) => handleSearchChange(e), 500);

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

  useEffect(() => {
    if (query) {
      setSearchText(query);
    }
  }, [query]);

  return (
    <form
      style={{ width: '300px', marginTop: '8px', marginBottom: '8px' }}
      onSubmit={handleSearchSubmit}
    >
      <TextField
        autoComplete="off"
        value={searchText}
        placeholder="Search"
        onChange={(e) => {
          debounced(e);
          setSearchText(e.target.value);
        }}
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
          endAdornment: searchText && (
            <XCircleIcon
              onClick={() => setSearchText('')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
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
            <Typography sx={{ p: 2 }}>
              No search results for {searchText}
            </Typography>
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
                <TagSuggestionCard tag={tag} />
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
