import { Outlet } from '@modern-js/runtime/router';
import { Box } from '@mui/material';
import Theme from './theme';
import Sidebar from '@/components/Sidebar';

export default function Layout() {
  return (
    <Theme>
      <Box sx={{ height: '100vh', width: '100%', display: 'flex' }}>
        <Sidebar />
        <Box sx={{ padding: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Theme>
  );
}
