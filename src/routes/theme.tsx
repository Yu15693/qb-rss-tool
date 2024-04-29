import type { PropsWithChildren } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import '@/assets/css/global.css';

const theme = createTheme(
  {
    typography: {
      fontFamily:
        'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji,BlinkMacSystemFont,Helvetica Neue,Arial,PingFang SC,PingFang TC,PingFang HK,Microsoft Yahei,Microsoft JhengHei',
    },
  },
  zhCN,
);

export default function Theme(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
