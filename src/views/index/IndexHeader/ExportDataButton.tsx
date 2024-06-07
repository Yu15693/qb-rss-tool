import { Button, CircularProgress } from '@mui/material';
import { useRequest } from 'ahooks';
import { useSnackbar } from 'notistack';
import { useIndexStore } from '../store';
import { exportRuleFile } from '@/utils/rss';

export default function ExportDataButton() {
  const { enqueueSnackbar } = useSnackbar();
  const subList = useIndexStore(state => state.subList);

  const { runAsync: doExportData, loading: exportDataLoading } = useRequest(
    () => {
      return exportRuleFile(subList)
        .then(res => {
          res &&
            enqueueSnackbar({
              message: res,
              variant: 'success',
            });
        })
        .catch(err => {
          err &&
            enqueueSnackbar({
              message: `${err}`,
              variant: 'error',
            });
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
      导出数据
    </Button>
  );
}