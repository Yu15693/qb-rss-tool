import { Outlet } from '@modern-js/runtime/router';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import Theme from '@/views/layout/Theme';
import Sidebar from '@/views/layout/Sidebar';

export default function Layout() {
  return (
    <Theme>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
      >
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Sidebar />
          <Box sx={{ paddingX: 2, paddingTop: 2, flex: 1, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </SnackbarProvider>
    </Theme>
  );
}
