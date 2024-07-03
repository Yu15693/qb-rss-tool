import path from 'path';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import {
  Visibility as IconVisibility,
  VisibilityOff as IconVisibilityOff,
} from '@mui/icons-material';
import {
  BaseDirectory,
  readDir,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog';
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
  const [showPassword, setShowPassword] = useState(false);

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

  const onDownloadLogFile = async () => {
    const logFileList = await readDir('', { dir: BaseDirectory.AppLog });
    // get dir path
    const dirPath = await open({
      directory: true,
    });
    if (!dirPath || Array.isArray(dirPath)) {
      return;
    }
    const newFileName = `${__APP_NAME__}-log-file-${new Date().getTime()}`;
    const newFilePath = path.join(dirPath, newFileName);
    // write log file
    for (const file of logFileList) {
      const content = await readTextFile(file.path);
      await writeTextFile(newFilePath, content, {
        append: true,
      });
    }
  };

  return (
    <Stack gap={2}>
      <Box component="form" width={616} onSubmit={handleSubmit(onSubmit)}>
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
              sx={{ width: 480 }}
              {...register('ip')}
            />
            <TextField
              label="端口"
              type="number"
              size="small"
              sx={{ width: 120 }}
              {...register('port')}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <TextField
              label="用户名"
              type="text"
              size="small"
              sx={{ width: 300 }}
              {...register('username')}
            />
            <TextField
              label="密码"
              type={showPassword ? 'text' : 'password'}
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IconVisibilityOff fontSize="inherit" />
                      ) : (
                        <IconVisibility fontSize="inherit" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
            />
          </Stack>
        </Stack>
      </Box>
      <Stack gap={2}>
        <Typography variant="h6">日志配置</Typography>
        <Box>
          <Button variant="contained" onClick={onDownloadLogFile}>
            下载日志文件
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
