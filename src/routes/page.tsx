import { Box, Grid } from '@mui/material';
import IndexHeader from '@/views/index/IndexHeader';
import SubItemList from '@/views/index/SubItemList';
import SubItemBlock from '@/views/index/SubItemBlock';

export default function IndexPage() {
  return (
    <Box height="100%">
      <IndexHeader />
      <Grid container height="calc(100% - 60px)">
        <Grid
          item
          xs={4}
          height="100%"
          sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}
        >
          <SubItemList />
        </Grid>
        <Grid item xs={8} height="100%">
          <SubItemBlock />
        </Grid>
      </Grid>
    </Box>
  );
}
