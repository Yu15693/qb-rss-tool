import { Button, CircularProgress } from '@mui/material';
import { useRequest } from 'ahooks';
import { useSnackbar } from 'notistack';
import { getSlimSubList, useIndexStore } from '../store';
import { injectRuleData } from '@/utils/rss';
import { useSettingsStore } from '@/views/settings/store';
import { recordLog } from '@/utils/log';

export default function InjectDataButton() {
  const { enqueueSnackbar } = useSnackbar();
  const authConfig = useSettingsStore(state => state.authConfig);
  const subList = useIndexStore(state => state.subList);

  const { runAsync: doExportData, loading: exportDataLoading } = useRequest(
    () => {
      recordLog('info', 'doExportData', {
        authConfig,
        subList: getSlimSubList(subList),
      });
      return injectRuleData(authConfig, subList)
        .then(res => {
          res &&
            enqueueSnackbar({
              message: res,
              variant: 'success',
            });
        })
        .catch(err => {
          if (err) {
            recordLog('error', 'doExportData', err);
            enqueueSnackbar({
              message: `${err}`,
              variant: 'error',
            });
          }
        });
    },
    {
      manual: true,
    },
  );

  return (
    <Button
      variant="outlined"
      onClick={doExportData}
      disabled={exportDataLoading}
    >
      {exportDataLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
      注入数据
    </Button>
  );
}
