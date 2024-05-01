import {
  ListItemButton,
  ListItemText,
  List,
  ListSubheader,
} from '@mui/material';
import { useIndexStore } from '../store';
import { mustContainMatch, mustNotContainMatch } from '@/utils/format';

export default function FeedMatchBlock() {
  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink)!;

  const matchList = selectedSubItem.rssFeed.items.filter(v => {
    // TODO: test match
    return (
      mustContainMatch(selectedSubItem.mustContain, v.title) &&
      mustNotContainMatch(selectedSubItem.mustNotContain, v.title)
    );
  });

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
      sx={{ height: 'calc(100% - 222px)', overflow: 'auto' }}
      subheader={<ListSubheader>匹配项</ListSubheader>}
    >
      {matchListJSX}
    </List>
  );
}
