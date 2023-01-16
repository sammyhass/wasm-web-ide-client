import Navbar from '@/components/Navbar';
import { useProject } from '@/hooks/api/useProject';
import { useEditor } from '@/hooks/useEditor';
import Container from '@/layouts/Container';
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
  const initProject = useEditor(s => s.initProject);
  const { data, error, status } = useProject(props.id, {
    cacheTime: 0,
    refetchOnWindowFocus: false,
    onSettled: (data, error) => {
      if (error || !data) return;
      initProject(data);
    },
  });

  const title =
    status === 'success' && data
      ? data.name
      : status === 'error'
      ? ''
      : 'Loading';
  return (
    <ProtectedPage>
      <Navbar title={<h1 className="text-xl font-bold">{title}</h1>} />
      {status === 'success' && data && props.id && (
        <ProjectEditor id={props.id} />
      )}

      {status === 'error' && (
        <Container>
          <div className="flex flex-col items-center justify-center h-full bg-base-200 shadow-md min-h-16">
            <h1 className="text-2xl font-bold">Project Not Found</h1>

            <p className="text-base text-center">
              The project you are looking for does not exist or you do not have
              access to it.
            </p>
          </div>
        </Container>
      )}
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
