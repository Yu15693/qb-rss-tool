import { Button, Box, TextField, IconButton } from '@mui/material';
import { useState } from 'react';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';

export default function Index() {
  const [addressValue, setAddressValue] = useState('');

  return (
    <Box>
      <Box display="flex" gap={2}>
        <TextField
          label="输入RSS地址"
          type="text"
          fullWidth
          value={addressValue}
          onChange={e => setAddressValue(e.target.value)}
          InputProps={{
            endAdornment: addressValue ? (
              <IconButton onClick={() => setAddressValue('')}>
                <IconClearOutlined />
              </IconButton>
            ) : undefined,
          }}
        />
        <Button variant="contained">新增</Button>
      </Box>
    </Box>
  );
}
