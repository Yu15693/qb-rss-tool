import {
  ListItemButton,
  ListItemText,
  List,
  ListSubheader,
} from '@mui/material';
import { useIndexStore } from '../store';

export default function FeedMatchBlock() {
  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink)!;

  const matchList = selectedSubItem.rssFeed.items.map(v => {
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
      {matchList}
    </List>
  );
}
