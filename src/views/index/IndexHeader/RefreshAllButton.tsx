import { Button, CircularProgress } from '@mui/material';
import { useRequest } from 'ahooks';
import { useIndexStore } from '../store';
import { fetchRSS } from '@/utils/rss';

export default function RefreshAllButton() {
  const indexStore = useIndexStore();

  const { runAsync: doRefreshAll, loading: refreshLoading } = useRequest(
    async () => {
      const taskList = indexStore.subList.map(v => {
        indexStore.editSubItem(v.link, {
          fetchStatus: 'loading',
        });
        return fetchRSS(v.link)
          .then(res => {
            indexStore.editSubItem(v.link, {
              rssFeed: res,
              fetchTime: new Date().getTime(),
              fetchStatus: 'success',
            });
          })
          .catch(err => {
            // TODO: record log
            console.error(err);
            indexStore.editSubItem(v.link, {
              fetchStatus: 'fail',
            });
          });
      });

      await Promise.all(taskList);
    },
    {
      manual: true,
    },
  );

  return (
    <Button variant="outlined" onClick={doRefreshAll} disabled={refreshLoading}>
      {refreshLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
      刷新全部
    </Button>
  );
}
