import ProjectsGrid from '@/components/ProjectsGrid';
import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';

export default function ProjectsPage() {
  return (
    <ProtectedPage>
      <Container title={'Your Projects'}>
        <ProjectsGrid />
      </Container>
    </ProtectedPage>
  );
}
