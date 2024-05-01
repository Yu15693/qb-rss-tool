import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useRequest } from 'ahooks';
import { SubItem, useIndexStore } from '../store';
import { exportRuleFile, fetchRSS } from '@/utils/rss';
import { formatTitle } from '@/utils/format';

interface IForm {
  rssUrl: string;
}

const urlRegExp =
  /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;

export default function IndexHeader() {
  const { enqueueSnackbar } = useSnackbar();
  const indexStore = useIndexStore();
  const { control, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: {
      rssUrl: '',
    },
  });

  const { runAsync: doFetchRSS, loading: fetchLoading } = useRequest(
    (rssUrl: string) => {
      return fetchRSS(rssUrl)
        .then(res => {
          const newSubItem: SubItem = {
            title: formatTitle(res.title),
            link: rssUrl,
            mustContain: '',
            mustNotContain: '',
            useRegex: false,
            rssFeed: res,
          };
          indexStore.addSubItem(newSubItem);
          setValue('rssUrl', '');
        })
        .catch(err => {
          console.error(err);
          enqueueSnackbar({
            message: `请求失败:${err.message ?? err}`,
            variant: 'error',
          });
        });
    },
    {
      manual: true,
    },
  );

  const { runAsync: doExportData, loading: exportDataLoading } = useRequest(
    () => {
      return exportRuleFile(indexStore.subList)
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

  const onSubmit = (data: IForm) => {
    // TODO: record log
    const { rssUrl } = data;

    if (!urlRegExp.test(rssUrl)) {
      enqueueSnackbar({
        message: '请输入正确格式的RSS地址',
        variant: 'warning',
      });
      return;
    }
    if (indexStore.findSubItem(rssUrl)) {
      enqueueSnackbar({
        message: '已存在相同地址的RSS订阅',
        variant: 'warning',
      });
      return;
    }

    doFetchRSS(rssUrl);
  };

  const onClear = () => {
    indexStore.clearSubList();
  };

  return (
    <Box
      component="form"
      display="flex"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="rssUrl"
        control={control}
        render={({ field }) => {
          const { value, onChange } = field;
          return (
            <TextField
              label="输入RSS地址"
              type="text"
              fullWidth
              {...field}
              InputProps={{
                endAdornment: value ? (
                  <IconButton
                    title="清空"
                    onClick={() => onChange({ target: { value: '' } })}
                  >
                    <IconClearOutlined />
                  </IconButton>
                ) : undefined,
              }}
            />
          );
        }}
      />
      <Stack direction="row" spacing={2} flexShrink={0} paddingY={0.5}>
        <Button variant="contained" type="submit" disabled={fetchLoading}>
          {fetchLoading && <CircularProgress size={20} />}
          新增
        </Button>
        <Button variant="outlined">刷新全部</Button>
        <Button variant="outlined" color="error" onClick={onClear}>
          清空
        </Button>
        <Button variant="outlined">导入数据</Button>
        <Button
          variant="outlined"
          onClick={() => {
            doExportData();
          }}
        >
          {exportDataLoading && <CircularProgress size={20} />}
          导出数据
        </Button>
      </Stack>
    </Box>
  );
}
