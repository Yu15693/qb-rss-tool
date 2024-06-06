import { Link, Stack, Typography } from '@mui/material';

// TODO: 完善关于信息
export default function AboutPage() {
  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Typography variant="h6">版本</Typography>
        <Typography variant="body1">
          <span>开源地址：</span>
          <Link href={__APP_REPOSITORY__} target="_blank" rel="noreferrer">
            {__APP_REPOSITORY__}
          </Link>
        </Typography>
        <Typography variant="body1">
          <span>当前版本：</span>
          <span>v{__APP_VERSION__}</span>
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Typography variant="h6">简介</Typography>
        <Typography variant="body1">
          <div>
            <Typography component="span" color="error.main" mr={1}>
              {__APP_NAME__}
            </Typography>
            <span>是用于辅助 qbittorrent 的 RSS 自动下载功能的工具</span>
          </div>
          <div>
            可以在添加 RSS
            订阅列表后指定一个文件目录，在该目录下新建各个订阅的文件夹，并向
            qbittorrent 自动注入下载规则
          </div>
          <div>帮助你免去手动新建文件夹和填写下载规则的重复性操作</div>
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Typography variant="h6">如何使用</Typography>
        <Typography variant="body1">
          <div>1.TODO</div>
          <div>2.TODO</div>
        </Typography>
      </Stack>
    </Stack>
  );
}
