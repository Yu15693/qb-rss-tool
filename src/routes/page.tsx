import { Button, Box, TextField, IconButton } from '@mui/material';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
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

export default function IndexPage() {
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      rssUrl: '',
    },
  });

  const [subList, setSubList] = useState<SubItem[]>([]);

  const onSubmit = (data: IForm) => {
    console.log(data);
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

  console.log(subList);

  return (
    <Box>
      <Box>
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
          <Button variant="contained" type="submit">
            新增
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
