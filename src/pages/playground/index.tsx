// Playground Page using WebContainers to provide a sandboxed environment

import Navbar from '@/components/Navbar';
import PlaygroundEditor from '@/components/playground';
import SEO from '@/components/seo';
import { env } from '@/env/server.mjs';
import { filesystem } from '@/lib/webcontainers/files/defaults';
import type { FileSystemTree } from '@webcontainer/api';
import Redis from 'ioredis';
import type { GetServerSideProps } from 'next';

type PageProps = {
  files: FileSystemTree;
};

function PlaygroundPage({ files }: PageProps) {
  return (
    <>
      <SEO title="Playground" />
      <div className="flex flex-col h-screen">
        <Navbar />
        <PlaygroundEditor mount={files} />
      </div>
    </>
  );
}

PlaygroundPage.getLayout = (page: React.ReactNode) => {
  return <>{page}</>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  const redis = new Redis(env.REDIS_URL);
  const shortcode = query.code as string;

  if (!shortcode) {
    return {
      props: {
        files: filesystem,
      },
    };
  }

  const base64 = await redis.get(`shortcode:${shortcode}`);

  if (!base64) {
    return {
      notFound: true,
    };
  }

  const tree = JSON.parse(Buffer.from(base64, 'base64').toString());

  return {
    props: {
      files: { ...tree, lib: filesystem.lib },
    },
  };
};

export default PlaygroundPage;
