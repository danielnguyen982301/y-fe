import Image from 'next/image';
import { Box } from '@mui/material';
import Link from 'next/link';

function Logo({
  disabledLink = false,
  sx,
}: {
  disabledLink?: boolean;
  sx?: Record<string, any>;
}) {
  const logo = (
    <Box sx={{ ...sx }}>
      <Image src="/logo.png" alt="logo" width={40} height={40} />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <Link href="/">{logo}</Link>;
}

export default Logo;
