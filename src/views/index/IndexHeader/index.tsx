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
import ExportDataButton from './ExportDataButton';
import RefreshAllButton from './RefreshAllButton';
import { fetchRSS } from '@/utils/rss';
import { formatTitle } from '@/utils/format';
import IconButtonPaste from '@/components/IconButtonPaste';

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
            fetchTime: new Date().getTime(),
            fetchStatus: 'success',
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
                ) : (
                  <IconButtonPaste
                    onPaste={value => onChange({ target: { value } })}
                  />
                ),
              }}
            />
          );
        }}
      />
      <Stack direction="row" spacing={2} flexShrink={0} paddingY={0.5}>
        <Button variant="contained" type="submit" disabled={fetchLoading}>
          {fetchLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          新增
        </Button>
        <RefreshAllButton />
        <Button variant="outlined" color="error" onClick={onClear}>
          清空
        </Button>
        <ExportDataButton />
      </Stack>
    </Box>
  );
}
