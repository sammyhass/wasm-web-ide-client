import ProjectsGrid from '@/components/ProjectsGrid';
import { useProjects } from '@/hooks/api/useProjects';
import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';

export default function ProjectsPage() {
  return (
    <ProtectedPage>
      <Container title={'Your Projects'}>
        <Projects />
      </Container>
    </ProtectedPage>
  );
}

function Projects() {
  const { data, isLoading } = useProjects();
  return <ProjectsGrid projects={data} loading={isLoading} />;
}
