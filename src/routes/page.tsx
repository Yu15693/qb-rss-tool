import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { invoke } from '@tauri-apps/api';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    invoke('greet', { name: 'World' }).then(res => console.log(res));
  }, []);
  return (
    <Box>
      <Typography>Hello,world</Typography>
      <Button variant="contained">sample button</Button>
    </Box>
  );
}
