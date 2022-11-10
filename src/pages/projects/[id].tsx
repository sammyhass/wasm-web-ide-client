import Navbar from '@/components/Navbar';
import { useProject } from '@/hooks/api/useProject';
import ProtectedPage from '@/layouts/ProtectedPage';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

const ProjectEditor = dynamic(() => import('@/components/ProjectEditor'), {
  ssr: false,
});

type Props = {
  id: string | undefined;
};
export default function ProjectOverviewPage(props: Props) {
  const { data, error, status } = useProject(props.id);
  const title = data?.name ?? 'Loading...';
  return (
    <ProtectedPage>
      <Navbar title={<h1 className="text-xl font-bold">{title}</h1>} />
      {status === 'success' && data && <ProjectEditor {...data} />}
    </ProtectedPage>
  );
}

ProjectOverviewPage.getLayout = (page: React.ReactNode) => {
  return <>{page}</>;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const id = ctx.params?.id as string | undefined;

  return {
    props: { id },
  };
};
