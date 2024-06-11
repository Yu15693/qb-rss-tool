import { Box, Stack, Typography, TextField, Checkbox } from '@mui/material';
import { useDebounceFn } from 'ahooks';
import { useState, useEffect } from 'react';
import { useIndexStore } from '../store';
import IconButtonCopy from '@/components/IconButtonCopy';
import { formatDateTime } from '@/utils/format';

export default function FeedEditBlock() {
  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink)!;
  const [tempValue, setTempValue] = useState({
    title: '',
    mustContain: '',
    mustNotContain: '',
  });

  const { run: syncTempValue } = useDebounceFn(
    (link: string, value: Partial<typeof tempValue>) => {
      indexStore.editSubItem(link, value);
    },
    { wait: 200 },
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
      <Stack direction="row" alignItems="center">
        <Typography variant="body2" color="grey" noWrap>
          <span style={{ userSelect: 'none' }}>地址：</span>
          <span title={selectedSubItem.link}>{selectedSubItem.link}</span>
        </Typography>
        <IconButtonCopy
          key={selectedSubItem.link}
          copyText={selectedSubItem.link}
          buttonProps={{ size: 'small' }}
        />
      </Stack>
      <Typography variant="body2" color="grey" marginBottom={2}>
        <span style={{ userSelect: 'none' }}>刷新时间：</span>
        <span>{formatDateTime(selectedSubItem.fetchTime)}</span>
      </Typography>
      <TextField
        label="标题"
        type="text"
        size="small"
        inputProps={{ maxLength: 100 }}
        fullWidth
        value={tempValue.title}
        onChange={e => changeTempValue({ title: e.target.value })}
      />

      <Typography marginY={1} variant="body2">
        <Checkbox
          size="small"
          checked={selectedSubItem.useRegex}
          onChange={e => {
            indexStore.editSubItem(selectedSubItem.link, {
              useRegex: e.target.checked,
            });
          }}
        />
        使用正则表达式
      </Typography>

      <Stack direction="row" gap={2}>
        <TextField
          label="必须包含"
          type="text"
          size="small"
          inputProps={{ maxLength: 100 }}
          fullWidth
          value={tempValue.mustContain}
          onChange={e => changeTempValue({ mustContain: e.target.value })}
        />
        <TextField
          label="必须不含"
          type="text"
          size="small"
          inputProps={{ maxLength: 100 }}
          fullWidth
          value={tempValue.mustNotContain}
          onChange={e => changeTempValue({ mustNotContain: e.target.value })}
        />
      </Stack>
    </Box>
  );
}
