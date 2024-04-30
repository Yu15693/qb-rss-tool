import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';
import { SubItem, useIndexStore } from '../store';
import { fetchRSS } from '@/utils/rss';
import { formatTitle } from '@/utils/format';

interface IForm {
  rssUrl: string;
}

export default function IndexHeader() {
  const indexStore = useIndexStore();
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      rssUrl: '',
    },
  });

  const onSubmit = (data: IForm) => {
    const { rssUrl } = data;

    if (!rssUrl.startsWith('https://')) {
      return;
    }
    if (indexStore.findSubItem(rssUrl)) {
      return;
    }

    fetchRSS(rssUrl)
      .then(res => {
        const newSubItem: SubItem = {
          title: formatTitle(res.title),
          mustContain: '',
          mustNotContain: '',
          rssFeed: res,
        };
        indexStore.addSubItem(newSubItem);
      })
      .catch(err => {
        console.error(err);
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
