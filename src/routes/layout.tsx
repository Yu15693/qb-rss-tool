import { Outlet } from '@modern-js/runtime/router';
import Theme from './theme';

export default function Layout() {
  return (
    <Theme>
      <Outlet />
    </Theme>
  );
}
