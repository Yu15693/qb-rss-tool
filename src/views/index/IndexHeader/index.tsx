import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { SubItem, useIndexStore } from '../store';
import { fetchRSS } from '@/utils/rss';
import { formatTitle } from '@/utils/format';

interface IForm {
  rssUrl: string;
}

const urlRegExp =
  /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;

export default function IndexHeader() {
  const { enqueueSnackbar } = useSnackbar();
  const indexStore = useIndexStore();
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      rssUrl: '',
    },
  });

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

    fetchRSS(rssUrl)
      .then(res => {
        const newSubItem: SubItem = {
          title: formatTitle(res.title),
          link: rssUrl,
          mustContain: '',
          mustNotContain: '',
          rssFeed: res,
        };
        indexStore.addSubItem(newSubItem);
      })
      .catch(err => {
        console.error(err);
        enqueueSnackbar({
          message: `请求失败:${err.message ?? err}`,
          variant: 'error',
        });
      });
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
        <Button variant="contained" type="submit">
          新增
        </Button>
        <Button variant="outlined">刷新全部</Button>
        <Button variant="outlined" color="error" onClick={onClear}>
          清空
        </Button>
      </Stack>
    </Box>
  );
}
