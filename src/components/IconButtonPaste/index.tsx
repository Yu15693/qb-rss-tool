import { IconButton, IconButtonProps } from '@mui/material';
import { ContentPaste as IconPaste } from '@mui/icons-material';
import { readText } from '@tauri-apps/api/clipboard';

interface IProps {
  buttonProps?: IconButtonProps;
  onPaste: (value: string) => void;
}

export default function IconButtonPaste(props: IProps) {
  const { buttonProps, onPaste } = props;

  const onCopy = () => {
    readText()
      .then(res => {
        res && onPaste(res);
      })
      .catch(err => {
        // TODO: record
        console.error(err);
      });
  };

  return (
    <IconButton {...buttonProps} title="粘贴" onClick={onCopy}>
      <IconPaste fontSize="inherit" />
    </IconButton>
  );
}
