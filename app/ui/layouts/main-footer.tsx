import React from 'react';
import { Link, Typography } from '@mui/material';

export default function MainFooter() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" p={1}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.coderschool.vn">
        CoderSchool
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
