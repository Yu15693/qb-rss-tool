import { Outlet } from '@modern-js/runtime/router';
import { Box } from '@mui/material';
import Theme from '@/views/layout/Theme';
import Sidebar from '@/views/layout/Sidebar';

export default function Layout() {
  return (
    <Theme>
      <Box sx={{ height: '100vh', width: '100%', display: 'flex' }}>
        <Sidebar />
        <Box sx={{ paddingX: 2, paddingTop: 2, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Theme>
  );
}
