import {
  Home as IconHome,
  Settings as IconSettings,
} from '@mui/icons-material';
import { TabItemProps } from './TabItem';

export const tabItemList: TabItemProps[] = [
  {
    label: '主页',
    href: '/',
    icon: <IconHome />,
  },
];

export const bottomTabItem: TabItemProps = {
  label: '设置',
  href: '/setting',
  icon: <IconSettings />,
};
