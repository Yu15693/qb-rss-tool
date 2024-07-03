import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import {
  ContentCopy as IconCopy,
  Check as IconCheck,
} from '@mui/icons-material';
import { useState } from 'react';
import { writeText } from '@tauri-apps/api/clipboard';
import { recordLog } from '@/utils/log';

interface IProps {
  buttonProps?: IconButtonProps;
  copyText: string;
}

export default function IconButtonCopy(props: IProps) {
  const { copyText, buttonProps } = props;
  const [isDone, setIsDone] = useState(false);

  const onCopy = () => {
    if (isDone) {
      return;
    }
    writeText(copyText)
      .then(() => {
        setIsDone(true);
        setTimeout(() => {
          setIsDone(false);
        }, 2000);
      })
      .catch(err => {
        recordLog('error', 'onCopy', err);
      });
  };

  return (
    <Tooltip title="已复制" open={isDone}>
      <IconButton {...buttonProps} onClick={onCopy}>
        {isDone && <IconCheck fontSize="inherit" />}
        {!isDone && <IconCopy fontSize="inherit" />}
      </IconButton>
    </Tooltip>
  );
}
