import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { RSSFeed, fetchRSS } from '@/utils/rss';
import { formatTitle } from '@/utils/format';

interface IForm {
  rssUrl: string;
}

interface SubItem {
  title: string;
  mustContain: string;
  mustNotContain: string;
  rssFeed: RSSFeed;
}

export default function IndexHeader() {
  const [subList, setSubList] = useState<SubItem[]>([]);
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      rssUrl: '',
    },
  });

  const onSubmit = (data: IForm) => {
    console.log(data, subList);
    const { rssUrl } = data;
    fetchRSS(rssUrl)
      .then(res => {
        const newSubItem: SubItem = {
          title: formatTitle(res.title),
          mustContain: '',
          mustNotContain: '',
          rssFeed: res,
        };
        setSubList(v => [...v, newSubItem]);
      })
      .catch(err => {
        console.log(err);
      });
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
        <Button variant="outlined" color="error">
          清空
        </Button>
      </Stack>
    </Box>
  );
}
