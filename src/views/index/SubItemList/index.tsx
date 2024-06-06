import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  Delete as IconDelete,
  CheckCircleOutline as IconCheck,
  PendingOutlined as IconPending,
  HighlightOff as IconFail,
} from '@mui/icons-material';
import { useIndexStore } from '../store';

export default function SubItemList() {
  const indexStore = useIndexStore();
  const subItemListJSX = indexStore.subList.map(v => {
    const { link } = v;
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
          <ListItemIcon sx={{ minWidth: 30 }}>
            {v.fetchStatus === 'success' && <IconCheck />}
            {v.fetchStatus === 'loading' && <IconPending />}
            {v.fetchStatus === 'fail' && <IconFail />}
          </ListItemIcon>
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
