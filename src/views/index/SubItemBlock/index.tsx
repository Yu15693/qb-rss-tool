import { Box, ListSubheader, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { useIndexStore } from '../store';

export default function SubItemBlock() {
  const indexStore = useIndexStore();
  const selectedSubItem = indexStore.findSubItem(indexStore.selectedLink);
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
    <Box height="100%">
      <ListSubheader>配置详情</ListSubheader>
      {selectedSubItem && (
        <>
          <Box paddingLeft={2}>
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
                onChange={e =>
                  changeTempValue({ mustNotContain: e.target.value })
                }
              />
            </Stack>
          </Box>
          <ListSubheader>匹配项</ListSubheader>
        </>
      )}
    </Box>
  );
}
