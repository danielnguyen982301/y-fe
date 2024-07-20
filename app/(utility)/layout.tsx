import { Container } from '@mui/material';

import MainHeader from '../ui/layouts/main-header';
import ChatProvider from '../ChatProvider';
import NotificationProvider from '../NotificationProvider';
import MobileMainHeader from '../ui/layouts/mobile-main-header';
import AlertMsg from '../ui/alert-message';

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
        <Container
          maxWidth={false}
          sx={{
            width: '100%',
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            p: { xs: 0 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {modal}
          <MainHeader />
          <AlertMsg />
          <MobileMainHeader>
            {primary}
            {children}
          </MobileMainHeader>
        </Container>
      </ChatProvider>
    </NotificationProvider>
  );
}
