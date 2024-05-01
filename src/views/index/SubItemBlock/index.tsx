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
        <Tooltip title={'通配符模式'}>
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
