import Navbar from "@/components/Navbar";
import SEO from "@/components/seo";
import { useProject } from "@/hooks/api/useProject";
import Container from "@/layouts/Container";
import ProtectedPage from "@/layouts/ProtectedPage";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const ProjectEditor = dynamic(() => import("@/components/ProjectEditor"), {
  ssr: false,
});

type Props = {
  id: string | undefined;
};
export default function ProjectOverviewPage(props: Props) {
  const { data, status } = useProject(props.id);

  const title = useMemo(
    () =>
      status === "success" && data?.name
        ? data.name
        : status === "error"
        ? ""
        : "Loading",
    [status, data?.name]
  );

  return (
    <>
      <SEO title={title} />
      <ProtectedPage>
        <Navbar title={<h1 className="text-xl font-bold">{title}</h1>} />

        {status === "success" && data && props.id ? (
          <>
            <ProjectEditor {...data} />
          </>
        ) : (
          <Container>
            <div className="min-h-16 flex flex-col items-center justify-center gap-2 bg-base-200 py-4 shadow-md">
              <h1 className="text-2xl font-bold">
                {status === "error" ? "Project Not Found" : "Loading..."}
              </h1>
              <p className="text-center text-base">
                {status === "error"
                  ? "The project you are looking for does not exist or you do not have access to it."
                  : "Just a moment..."}
              </p>
            </div>
          </Container>
        )}
      </ProtectedPage>
    </>
  );
}

ProjectOverviewPage.getLayout = (page: React.ReactNode) => {
  return <>{page}</>;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = ctx.params?.id as string | undefined;

  return {
    props: { id },
  };
};
