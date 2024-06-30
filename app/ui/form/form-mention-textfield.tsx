'use client';

import apiService from '@/app/lib/apiService';
import { Hashtag } from '@/app/lib/definitions';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

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
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};

export default function MentionTextField({
  name,
  inputValue,
  ...other
}: Record<string, any>) {
  const { control } = useFormContext();
  // const [hashtags, setHashtags] = useState<{ id: string; display: string }[]>(
  //   [],
  // );

  const findLineBreaks = (input: string) => {
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

  const transformedInputValue = (input: string) => {
    const regex = /#\[(\w+)\]|#(\w+)/gm;

    let parts: any[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      if (lastIndex < match.index) {
        const inputPart = input.substring(lastIndex, match.index);
        parts = [...parts, ...findLineBreaks(inputPart)];
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
          }}
          key={match.index}
        >
          {match[1] ? `#${match[1]}` : `#${match[2]}`}
        </Typography>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < input.length) {
      const inputPart = input.substring(lastIndex);
      parts = [...parts, ...findLineBreaks(inputPart)];
    }
    return parts;
  };

  const fetchHashtags = async (
    query: string,
    callback: (data: SuggestionDataItem[]) => void,
  ) => {
    console.log('Query', query);
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
              {transformedInputValue(inputValue)}
            </Box>
          )}
          <MentionsInput
            placeholder="What is happening?!"
            {...field}
            {...other}
            style={defaultStyle}
          >
            <Mention
              style={{
                // color: 'rgb(137 197 237)',
                color: 'transparent',
              }}
              trigger="#"
              data={fetchHashtags}
              displayTransform={(id, display) => `#${display}`}
              renderSuggestion={(suggestion) => (
                <Box>#{suggestion.display}</Box>
              )}
              markup="#[__display__]"
              // regex={/#(\w+)/}
            />
          </MentionsInput>
        </Box>
      )}
    />
  );
}
