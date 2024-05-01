import { Box, Stack, Typography, IconButton, TextField } from '@mui/material';
import { useDebounceFn } from 'ahooks';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { ContentCopy as IconCopy } from '@mui/icons-material';
import { useIndexStore } from '../store';

export default function FeedEditBlock() {
  const { enqueueSnackbar } = useSnackbar();
  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink)!;
  const [tempValue, setTempValue] = useState({
    title: '',
    mustContain: '',
    mustNotContain: '',
  });

  const { run: syncTempValue } = useDebounceFn(
    (link: string, value: typeof tempValue) => {
      indexStore.editSubItem(link, value);
    },
    { wait: 100 },
  );

  const changeTempValue = (value: Partial<typeof tempValue>) => {
    setTempValue(v => {
      return {
        ...v,
        ...value,
      };
    });
    if (selectedSubItem) {
      syncTempValue(selectedSubItem.link, value);
    }
  };

  useEffect(() => {
    if (selectedSubItem) {
      setTempValue({
        title: selectedSubItem.title,
        mustContain: selectedSubItem.mustContain,
        mustNotContain: selectedSubItem.mustNotContain,
      });
    }
  }, [selectedSubItem]);

  return (
    <Box paddingLeft={2}>
      <Stack direction="row" marginBottom={2} alignItems="center">
        <Typography variant="body2" color="GrayText" noWrap>
          <span style={{ userSelect: 'none' }}>地址：</span>
          <span title={selectedSubItem.link}>{selectedSubItem.link}</span>
        </Typography>
        <IconButton
          size="small"
          title="复制"
          onClick={() => {
            navigator.clipboard
              .writeText(selectedSubItem.link)
              .then(() => {
                enqueueSnackbar({
                  message: '复制成功',
                  variant: 'success',
                });
              })
              .catch(() => {
                enqueueSnackbar({
                  message: '复制失败',
                  variant: 'success',
                });
              });
          }}
        >
          <IconCopy fontSize="small" />
        </IconButton>
      </Stack>

      <TextField
        label="标题"
        type="text"
        inputProps={{ maxLength: 100 }}
        fullWidth
        value={tempValue.title}
        onChange={e => changeTempValue({ title: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      <Stack direction="row" gap={2}>
        <TextField
          label="必须包含"
          type="text"
          inputProps={{ maxLength: 100 }}
          fullWidth
          value={tempValue.mustContain}
          onChange={e => changeTempValue({ mustContain: e.target.value })}
        />
        <TextField
          label="必须不含"
          type="text"
          inputProps={{ maxLength: 100 }}
          fullWidth
          value={tempValue.mustNotContain}
          onChange={e => changeTempValue({ mustNotContain: e.target.value })}
        />
      </Stack>
    </Box>
  );
}
