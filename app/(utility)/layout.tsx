import { Box, Container, Stack } from '@mui/material';
import MainHeader from '../ui/layouts/main-header';
import ChatProvider from '../ChatProvider';
import NotificationProvider from '../NotificationProvider';

export default function Layout({
  modal,
  primary,
  children,
}: {
  modal: React.ReactNode;
  primary: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <ChatProvider>
        <Container maxWidth={false} sx={{ display: 'flex' }}>
          {modal}
          {/* <Box>{modal}</Box> */}
          <MainHeader />
          {primary}
          {children}
        </Container>
      </ChatProvider>
    </NotificationProvider>
  );
}
