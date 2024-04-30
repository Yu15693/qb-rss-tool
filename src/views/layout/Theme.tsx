import type { PropsWithChildren } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import '@/assets/css/global.css';

function createCustomTheme() {
  const defaultTheme = createTheme(
    {
      typography: {
        fontFamily:
          'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji,BlinkMacSystemFont,Helvetica Neue,Arial,PingFang SC,PingFang TC,PingFang HK,Microsoft Yahei,Microsoft JhengHei',
      },
    },
    zhCN,
  );
  return {
    ...defaultTheme,
    gap: (spacing: number) => parseInt(defaultTheme.spacing(spacing), 10),
  };
}

declare module '@mui/material/styles' {
  interface Theme {
    gap: (spacing: number) => number;
  }
}

const theme = createCustomTheme();

export default function Theme(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
