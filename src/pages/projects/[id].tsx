import Navbar from '@/components/Navbar';
import { useProject } from '@/hooks/api/useProject';
import { useEditor } from '@/hooks/useEditor';
import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';

const ProjectEditor = dynamic(() => import('@/components/ProjectEditor'), {
  ssr: false,
});

type Props = {
  id: string | undefined;
};
export default function ProjectOverviewPage(props: Props) {
  const initProject = useEditor(s => s.initProject);
  const { data, status } = useProject(props.id);

  const hasInitialisedProject = useRef(false);

  useEffect(() => {
    if (!hasInitialisedProject.current && data?.id) {
      initProject(data);
      hasInitialisedProject.current = true;
    }
  }, [data?.id, initProject, props.id, data]);

  const title = useMemo(
    () =>
      status === 'success' && data?.name
        ? data.name
        : status === 'error'
        ? ''
        : 'Loading',
    [status, data?.name]
  );

  return (
    <ProtectedPage>
      <Navbar title={<h1 className="text-xl font-bold">{title}</h1>} />

      {status === 'success' && data && props.id ? (
        <ProjectEditor />
      ) : (
        <Container>
          <div className="flex flex-col items-center justify-center bg-base-200 shadow-md min-h-16 gap-2 py-4">
            <h1 className="text-2xl font-bold">
              {status === 'error' ? 'Project Not Found' : 'Loading...'}
            </h1>
            <p className="text-base text-center">
              {status === 'error'
                ? 'The project you are looking for does not exist or you do not have access to it.'
                : 'Just a moment...'}
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
