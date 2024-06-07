import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useSettingsStore } from '@/views/settings/store';

interface IForm {
  ip: string;
  port: string;
  username: string;
  password: string;
}

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const settingsStore = useSettingsStore();

  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: {
      ...settingsStore.authConfig,
    },
  });

  const onSubmit = (data: IForm) => {
    settingsStore.editAuthConfig({
      ...data,
    });
    enqueueSnackbar({
      message: '保存成功',
      variant: 'success',
    });
  };

  return (
    <Box component="form" width={516} onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">qbittorrent web ui 配置</Typography>
          <Button variant="outlined" type="submit">
            保存
          </Button>
        </Stack>
        <Stack direction="row" gap={2}>
          <TextField
            label="IP地址"
            type="text"
            size="small"
            sx={{ width: 400 }}
            {...register('ip')}
          />
          <TextField
            label="端口"
            type="number"
            size="small"
            sx={{ width: 100 }}
            {...register('port')}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <TextField
            label="用户名"
            type="text"
            size="small"
            sx={{ width: 250 }}
            {...register('username')}
          />
          <TextField
            label="密码"
            type="password"
            size="small"
            sx={{ width: 250 }}
            {...register('password')}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
