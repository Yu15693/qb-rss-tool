import {
  ListItemButton,
  ListItemText,
  List,
  ListSubheader,
  Box,
  Switch,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Warning as IconWarning } from '@mui/icons-material';
import { useIndexStore } from '../store';
import { mustContainMatch, mustNotContainMatch } from '@/utils/format';
import { recordLog } from '@/utils/log';

export default function FeedMatchBlock() {
  const [isFiltered, setIsFiltered] = useState(true);
  const [isMatchError, setIsMatchError] = useState(false);

  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink)!;

  const getMatchList = () => {
    // TODO: test match
    if (isFiltered) {
      try {
        const { useRegex, mustContain, mustNotContain, title } =
          selectedSubItem;
        recordLog('info', 'getMatchList', {
          title,
          useRegex,
          mustContain,
          mustNotContain,
        });
        const matchList = selectedSubItem.rssFeed.items.filter(v => {
          return (
            mustContainMatch(useRegex, mustContain, v.title) &&
            mustNotContainMatch(useRegex, mustNotContain, v.title)
          );
        });

        isMatchError && setIsMatchError(false);
        return matchList;
      } catch (err) {
        recordLog('error', 'getMatchList', err);
        setIsMatchError(true);
      }
    }
    return selectedSubItem.rssFeed.items;
  };

  const matchList = useMemo(
    () => getMatchList(),
    [selectedSubItem, isFiltered],
  );

  const matchListJSX = matchList.map(v => {
    return (
      <ListItemButton key={v.link}>
        <ListItemText
          title={v.title}
          primary={v.title}
          primaryTypographyProps={{ noWrap: true, variant: 'body2' }}
        />
      </ListItemButton>
    );
  });

  return (
    <List
      sx={{ height: 'calc(100% - 248px)', overflow: 'auto' }}
      subheader={
        <ListSubheader
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box>
            <Box component="span" marginRight={0.5}>
              匹配项
            </Box>
            {isMatchError && (
              <Tooltip
                title={
                  <Box>
                    <Box>过滤内容时出错</Box>
                    <Box>可能是【必须包含】或【必须不含】内容非法</Box>
                  </Box>
                }
              >
                <IconButton size="small" color="error">
                  <IconWarning />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box>
            <Switch
              checked={isFiltered}
              onChange={e => setIsFiltered(e.target.checked)}
            />
            <Box component="span">
              {isFiltered && '过滤'}
              {!isFiltered && '全部'}
            </Box>
            <Box component="span" marginLeft={2}>
              共 {matchList.length} 项
            </Box>
          </Box>
        </ListSubheader>
      }
    >
      {matchListJSX}
    </List>
  );
}
