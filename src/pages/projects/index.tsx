import ProjectsGrid from "@/components/ProjectsGrid";
import SEO from "@/components/seo";
import { useProjects } from "@/hooks/api/useProjects";
import Container from "@/layouts/Container";
import ProtectedPage from "@/layouts/ProtectedPage";

export default function ProjectsPage() {
  return (
    <>
      <SEO title="Projects" />
      <ProtectedPage>
        <Container title={"Your Projects"}>
          <Projects />
        </Container>
      </ProtectedPage>
    </>
  );
}

function Projects() {
  const { data, isLoading } = useProjects();
  return <ProjectsGrid projects={data} loading={isLoading} />;
}
