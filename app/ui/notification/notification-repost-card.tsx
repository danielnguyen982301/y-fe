import { ArrowPathRoundedSquareIcon } from '@heroicons/react/20/solid';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { Post, Reply, User } from '@/app/lib/definitions';
import { findLineBreaks } from '../form/form-mention-textfield';

export default function NotificationRepostCard({
  sender,
  repost,
  repostType,
  isNotifRead,
}: {
  sender: User;
  repost: Post | Reply;
  repostType: 'Post' | 'Reply';
  isNotifRead?: boolean;
}) {
  const router = useRouter();
  return (
    <Box
      onClick={() =>
        router.push(
          `/main/${repost.author.username}/${
            repostType === 'Post' ? 'posts' : 'replies'
          }/${repost._id}`,
        )
      }
      sx={{
        width: '100%',
        display: 'flex',
        px: 2,
        py: 1,
        borderBottom: isNotifRead
          ? '1px solid rgb(239, 243, 244)'
          : '1px solid rgba(69,68,63,0.5)',
        bgcolor: isNotifRead ? '' : 'rgba(243,241,197,0.5)',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', cursor: 'pointer' },
      }}
    >
      <Box>
        <ArrowPathRoundedSquareIcon width={40} height={30} />
      </Box>
      <Stack spacing={1} sx={{ pl: 1 }}>
        <Box>
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={sender.avatar}
            alt="sender-avatar"
          />
        </Box>
        <Box>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            {sender.displayName}
          </Typography>{' '}
          reposted your {repostType === 'Post' ? 'post' : 'reply'}
        </Box>
        <Box sx={{ fontSize: 15, color: 'rgb(83, 100, 113)' }}>
          {findLineBreaks(repost.content)}
        </Box>
      </Stack>
    </Box>
  );
}
