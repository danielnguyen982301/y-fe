import { Box } from '@mui/material';
import Link from 'next/link';

export default function Logo({ sx }: { sx: Record<string, any> }) {
  return (
    <Box sx={{ ...sx }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 20 10 L 50 50"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 80 10 L 50 50"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 50 50 L 20 90"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </Box>
  );
}
