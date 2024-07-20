'use client';

import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useFormContext, Controller } from 'react-hook-form';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import { useDebouncedCallback } from 'use-debounce';

import apiService from '@/app/lib/apiService';
import { Hashtag, User } from '@/app/lib/definitions';

const defaultStyle = {
  '&multiLine': {
    input: {
      border: 'none',
      padding: 0,
      fontSize: 20,
      lineHeight: 'inherit',
      color: 'transparent',
      caretColor: 'black',
      width: '100%',
    },
    highlighter: {
      border: 'none',
      fontSize: 20,
      padding: 0,
      width: '100%',
    },
  },
  suggestions: {
    list: {
      width: '300px',
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 15,
    },
    item: {
      padding: '5px 15px',
      '&focused': {
        backgroundColor: 'rgba(0,0,0,0.03)',
      },
    },
  },
};

export const findLineBreaks = (input: string) => {
  const regex = /\n/gm;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    if (lastIndex < match.index) {
      parts.push(input.substring(lastIndex, match.index));
    }

    parts.push(<br key={match.index} />);

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    parts.push(input.substring(lastIndex));
  }
  return parts;
};

export const transformedFormInput = (content: string) => {
  const regex = /#\[(\w+)\]|#(\w+)|@\((\w+)\)\[([\s\w\-]+)\]/gm;
  let parts: any[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (lastIndex < match.index) {
      const contentPart = content.substring(lastIndex, match.index);
      parts = [...parts, ...findLineBreaks(contentPart)];
    }

    parts.push(
      <Typography
        component="span"
        sx={{
          color: 'rgb(29, 155, 240)',
          position: 'relative',
          zIndex: 100,
          fontSize: 20,
          fontFamily: 'inherit',
          letterSpacing: 'inherit',
        }}
        key={`${Date.now()} - ${Math.random()}`}
      >
        {match[1] || match[2]
          ? match[1]
            ? `#${match[1]}`
            : `#${match[2]}`
          : `@${match[4].split('-')[1]}`}
      </Typography>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content?.length) {
    const contentPart = content.substring(lastIndex);
    parts = [...parts, ...findLineBreaks(contentPart)];
  }
  return parts;
};

export const transformedContent = (content: string) => {
  const regex = /(#\w+)|@(\w+)/gm;
  let parts: any[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (lastIndex < match.index) {
      const contentPart = content.substring(lastIndex, match.index);
      parts = [...parts, ...findLineBreaks(contentPart)];
    }

    parts.push(
      match[1] ? (
        <Link
          onClick={(e) => e.stopPropagation()}
          prefetch={false}
          className="hover:underline"
          href={`/main/explore?q=${encodeURIComponent(match[1])}`}
          style={{ color: 'rgb(29, 155, 240)' }}
          key={`${Date.now()} - ${Math.random()}`}
        >
          {match[1]}
        </Link>
      ) : (
        <Link
          onClick={(e) => e.stopPropagation()}
          prefetch={false}
          className="hover:underline"
          href={`/main/${match[2]}`}
          style={{ color: 'rgb(29, 155, 240)' }}
          key={`${Date.now()} - ${Math.random()}`}
        >
          @{match[2]}
        </Link>
      ),
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content?.length) {
    const contentPart = content.substring(lastIndex);
    parts = [...parts, ...findLineBreaks(contentPart)];
  }
  return parts;
};

export default function MentionTextField({
  formType,
  name,
  inputValue,
  ...other
}: Record<string, any>) {
  const { control } = useFormContext();

  const fetchHashtags = async (
    query: string,
    callback: (data: SuggestionDataItem[]) => void,
  ) => {
    try {
      const response = await apiService.get('/hashtags', {
        params: { searchText: query },
      });
      const transformedData = response.data.hashtags.map(
        (hashtag: Hashtag) => ({ id: hashtag._id, display: hashtag.name }),
      );
      callback(transformedData);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedHashtags = useDebouncedCallback(
    (query, callback) => fetchHashtags(query, callback),
    500,
  );

  const fetchUsers = async (
    query: string,
    callback: (data: SuggestionDataItem[]) => void,
  ) => {
    try {
      const response = await apiService.get('/users', {
        params: { searchText: query },
      });
      const transformedData = response.data.users.map((user: User) => ({
        id: user._id,
        display: `${user.displayName}-${user.username}`,
      }));
      callback(transformedData);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedUsers = useDebouncedCallback(
    (query, callback) => fetchUsers(query, callback),
    500,
  );

  const transformedInput = transformedFormInput(inputValue);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ position: 'relative' }}>
          {inputValue && (
            <Box
              suppressContentEditableWarning
              contentEditable
              sx={{
                width: '100%',
                padding: 0,
                fontSize: 20,
                position: 'absolute',
                zIndex: -1,
              }}
            >
              {transformedInput}
            </Box>
          )}
          <MentionsInput
            placeholder={
              formType === 'Post' ? 'What is happening?!' : 'Post your reply'
            }
            {...field}
            {...other}
            style={defaultStyle}
          >
            <Mention
              style={{
                color: 'transparent',
              }}
              trigger="#"
              data={debouncedHashtags}
              displayTransform={(id, display) => `#${display}`}
              renderSuggestion={(suggestion) => (
                <Box sx={{ py: 2 }}>#{suggestion.display}</Box>
              )}
              markup="#[__display__]"
            />
            <Mention
              style={{
                color: 'transparent',
              }}
              trigger="@"
              data={debouncedUsers}
              displayTransform={(id, display) => `@${display.split('-')[1]}`}
              renderSuggestion={(suggestion) => (
                <Stack sx={{ py: 2 }}>
                  {suggestion.display?.split('-').map((field, idx) => (
                    <Box
                      sx={{ fontWeight: idx ? '' : 'bold' }}
                      key={`${suggestion.id}-${field}`}
                    >
                      {idx ? `@${field}` : `${field}`}
                    </Box>
                  ))}
                </Stack>
              )}
              markup="@(__id__)[__display__]"
            />
          </MentionsInput>
        </Box>
      )}
    />
  );
}
