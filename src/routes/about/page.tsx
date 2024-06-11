import { FC } from 'react';
import { Box } from '@mui/material';
import ContentMDX from '@/views/about/content.mdx';

const ContentMDXComponent = ContentMDX as FC<{
  repoLink: string;
  version: string;
  appName: string;
}>;

export default function AboutPage() {
  return (
    <>
      <ContentMDXComponent
        repoLink={__APP_REPOSITORY__}
        version={__APP_VERSION__}
        appName={__APP_NAME__}
      />
      <Box height={30} />
    </>
  );
}
