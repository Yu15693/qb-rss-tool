import { Box, IconButton, ListSubheader, Tooltip } from '@mui/material';
import { Help as IconHelp } from '@mui/icons-material';
import { useIndexStore } from '../store';
import FeedMatchBlock from './FeedMatchBlock';
import FeedEditBlock from './FeedEditBlock';

export default function SubItemBlock() {
  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink);

  return (
    <Box height="100%">
      <ListSubheader>
        配置详情
        <Tooltip
          title={
            <Box>
              <Box>通配符模式：规则与qb内保持一致</Box>
              <Box>? 匹配任意单个字符</Box>
              <Box>* 匹配0个或多个任意字符</Box>
              <Box>空格 与运算符</Box>
              <Box>| 或运算符</Box>
            </Box>
          }
        >
          <IconButton size="small" sx={{ marginLeft: 0.5 }}>
            <IconHelp />
          </IconButton>
        </Tooltip>
      </ListSubheader>
      {selectedSubItem && (
        <>
          <FeedEditBlock />
          <FeedMatchBlock />
        </>
      )}
    </Box>
  );
}
