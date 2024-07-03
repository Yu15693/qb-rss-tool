import { useRouteError, isRouteErrorResponse } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { recordLog } from '@/utils/log';

export default function ErrorPage() {
  const error = useRouteError();

  let errMsg: string;
  if (isRouteErrorResponse(error)) {
    errMsg = error.data.message || error.statusText;
  } else if (error instanceof Error) {
    errMsg = error.message;
  } else {
    errMsg = JSON.stringify(error);
  }

  useEffect(() => {
    recordLog('error', 'ErrorBoundary', errMsg);
  }, [errMsg]);

  return (
    <Box padding={2}>
      <Typography variant="h5">Oops!</Typography>
      <Typography gutterBottom>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography>{errMsg}</Typography>
    </Box>
  );
}
