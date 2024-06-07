import { FC } from 'react';
import ContentMDX from '@/views/about/content.mdx';

const ContentMDXComponent = ContentMDX as FC<{
  repoLink: string;
  version: string;
  appName: string;
}>;

// TODO: 完善关于信息
export default function AboutPage() {
  return (
    <ContentMDXComponent
      repoLink={__APP_REPOSITORY__}
      version={__APP_VERSION__}
      appName={__APP_NAME__}
    />
  );
}
