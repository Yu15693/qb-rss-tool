import {
  Home as IconHome,
  Settings as IconSettings,
  Info as IconInfo,
} from '@mui/icons-material';
import { TabItemProps } from './TabItem';

export const tabItemList: TabItemProps[] = [
  {
    label: '主页',
    href: '/',
    icon: <IconHome />,
  },
];

export const bottomTabItemList: TabItemProps[] = [
  {
    label: '设置',
    href: '/settings',
    icon: <IconSettings />,
  },
  {
    label: '关于',
    href: '/about',
    icon: <IconInfo />,
  },
];
