import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Delete as IconDelete } from '@mui/icons-material';
import { useIndexStore } from '../store';

export default function SubItemList() {
  const indexStore = useIndexStore();
  const subItemListJSX = indexStore.subList.map(v => {
    const { link } = v.rssFeed;
    return (
      <ListItem
        key={link}
        disablePadding
        sx={{ overflow: 'auto' }}
        secondaryAction={
          <IconButton
            title="删除"
            onClick={() => indexStore.removeSubItem(link)}
          >
            <IconDelete />
          </IconButton>
        }
      >
        <ListItemButton
          selected={indexStore.selectedLink === link}
          onClick={() => indexStore.setLink(link)}
        >
          <ListItemText
            title={v.title}
            primary={v.title}
            primaryTypographyProps={{ noWrap: true }}
          />
        </ListItemButton>
      </ListItem>
    );
  });
  return (
    <List
      sx={{ height: '100%', overflow: 'auto' }}
      subheader={<ListSubheader>RSS订阅列表</ListSubheader>}
    >
      {subItemListJSX}
    </List>
  );
}
