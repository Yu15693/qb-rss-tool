import { IconButton, IconButtonProps } from '@mui/material';
import { ContentPaste as IconPaste } from '@mui/icons-material';
import { readText } from '@tauri-apps/api/clipboard';
import { recordLog } from '@/utils/log';

interface IProps {
  buttonProps?: IconButtonProps;
  onPaste: (value: string) => void;
}

export default function IconButtonPaste(props: IProps) {
  const { buttonProps, onPaste } = props;

  const onReadText = () => {
    readText()
      .then(res => {
        res && onPaste(res);
      })
      .catch(err => {
        recordLog('error', 'onReadText', err);
      });
  };

  return (
    <IconButton {...buttonProps} title="粘贴" onClick={onReadText}>
      <IconPaste fontSize="inherit" />
    </IconButton>
  );
}
