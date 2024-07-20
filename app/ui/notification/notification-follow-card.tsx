import { UserIcon } from '@heroicons/react/20/solid';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { User } from '@/app/lib/definitions';

export default function NotificationFollowCard({
  sender,
  isNotifRead,
}: {
  sender: User;
  isNotifRead?: boolean;
}) {
  const router = useRouter();
  return (
    <Box
      onClick={() => router.push(`/main/${sender.username}`)}
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
        <UserIcon width={40} height={30} />
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
          followed you
        </Box>
      </Stack>
    </Box>
  );
}
