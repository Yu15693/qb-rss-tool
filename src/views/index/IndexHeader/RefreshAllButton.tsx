import { Button, CircularProgress } from '@mui/material';
import { useRequest } from 'ahooks';
import { useIndexStore } from '../store';
import { fetchRSS } from '@/utils/rss';
import { recordLog } from '@/utils/log';

export default function RefreshAllButton() {
  const indexStore = useIndexStore();

  const { runAsync: doRefreshAll, loading: refreshLoading } = useRequest(
    async () => {
      recordLog('info', 'doRefreshAll', indexStore.subList);
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
            recordLog('error', 'doRefreshAll', err);
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
