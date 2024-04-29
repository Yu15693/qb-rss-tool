import { Box, Stack } from '@mui/material';
import { bottomTabItem, tabItemList } from './constant';
import TabItem from './TabItem';

export default function Sidebar() {
  return (
    <Box
      sx={{
        flexShrink: 0,
        width: 108,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
        {tabItemList.map(v => (
          <TabItem key={v.href} {...v} />
        ))}
      </Stack>
      <Box sx={{ flexShrink: 0 }}>
        <TabItem {...bottomTabItem} />
      </Box>
    </Box>
  );
}
