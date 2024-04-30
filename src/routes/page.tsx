import { Button, Box, TextField, IconButton } from '@mui/material';
import { ClearOutlined as IconClearOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

interface IForm {
  rssUrl: string;
}

export default function IndexPage() {
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      rssUrl: '',
    },
  });

  const onSubmit = (data: IForm) => {
    console.log(data);
  };

  return (
    <Box>
      <Box>
        <Box
          component="form"
          display="flex"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="rssUrl"
            control={control}
            render={({ field }) => {
              const { value, onChange } = field;
              return (
                <TextField
                  label="输入RSS地址"
                  type="text"
                  fullWidth
                  {...field}
                  InputProps={{
                    endAdornment: value ? (
                      <IconButton
                        onClick={() => onChange({ target: { value: '' } })}
                      >
                        <IconClearOutlined />
                      </IconButton>
                    ) : undefined,
                  }}
                />
              );
            }}
          />
          <Button variant="contained" type="submit">
            新增
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
