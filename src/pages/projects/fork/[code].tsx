import LanguageIcon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/Spinner';
import { useForkProject } from '@/hooks/api/useForkProject';
import { useSharedProject } from '@/hooks/api/useSharedProject';
import { useMeQuery } from '@/hooks/useMe';
import Container from '@/layouts/Container';
import { ProjectT } from '@/lib/api/services/projects';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

function SmallProjectOverview(project: ProjectT) {
  return (
    <div className={'flex flex-col items-center p-5'}>
      <LanguageIcon
        language={project.language === 'AssemblyScript' ? 'ts' : 'go'}
        className={'w-10 h-10'}
      />
      <h1 className={'text-4xl font-bold'}>{project.name}</h1>
    </div>
  );
}

export default function ForkProjectPage({ code }: { code: string }) {
  const { data: me } = useMeQuery();
  const {
    data: project,
    isLoading: projectLoading,
    error,
  } = useSharedProject(code);

  const { mutate: _mutate, isLoading: isForking } = useForkProject(code);
  const router = useRouter();

  const mutate = useCallback(() => {
    if (!me?.id) return;
    _mutate(void 0, {
      onSuccess: d => {
        router.push(`/projects/${d.id}`);
      },
    });
  }, [_mutate, me?.id, router]);

  return (
    <Container className="bg-base-300 rounded-md shadow-sm flex flex-col items-center p-5">
      {projectLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>Something went wrong</p>
      ) : project ? (
        <>
          <SmallProjectOverview {...project} />
          {me ? (
            <button
              className="btn btn-primary btn-xl btn-wide"
              onClick={mutate}
            >
              {isForking ? 'Forking...' : 'Fork this Project'}
            </button>
          ) : (
            <Link
              href={`/login?next=	${encodeURIComponent(
                `/projects/fork/${code}`
              )}`}
            >
              <button className="btn btn-xl btn-wide btn-primary">
                Login to Fork this Project
              </button>
            </Link>
          )}
        </>
      ) : (
        <p>Project not found</p>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.code as string;

  return {
    props: {
      code,
    },
  };
};
