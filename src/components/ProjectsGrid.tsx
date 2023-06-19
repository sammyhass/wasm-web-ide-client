import { ProjectT } from "@/lib/api/services/projects";
import { PlusIcon } from "@heroicons/react/24/solid";
import { formatRelative } from "date-fns";
import Link from "next/link";
import LanguageIcon from "./icons/Icon";

export default function ProjectsGrid(props: {
  projects?: ProjectT[];
  loading: boolean;
}) {
  if (props.loading) {
    return (
      <div className="flex justify-center text-center">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NewProjectCard />
      {props.projects?.map((p, i) => (
        <ProjectCard key={i} {...p} />
      ))}
    </div>
  );
}

function ProjectCard({ id, name, created_at, language }: ProjectT) {
  return (
    <Link
      href={`/projects/${id}`}
      className="relative cursor-pointer rounded-lg border bg-base-100 p-10 shadow-lg transition-all duration-200 hover:bg-base-200"
      data-testid="project-card"
    >
      <LanguageIcon
        className="absolute bottom-4 right-4 h-12 w-12"
        language={language === "AssemblyScript" ? "ts" : "go"}
      />
      <h1 className="text-2xl font-bold" data-testid="project-title">
        {name}
      </h1>
      <p className="text-base-content text-opacity-50">
        Created {formatRelative(new Date(created_at), Date.now())}
      </p>
    </Link>
  );
}

function NewProjectCard() {
  return (
    <Link
      href={"/projects/new"}
      passHref
      className="group flex h-60 cursor-pointer flex-col items-center justify-center rounded-lg border bg-base-100 shadow-lg transition-all duration-200 hover:bg-base-200"
      data-testid="new-project-button"
      tabIndex={0}
    >
      <PlusIcon className="h-10 w-10" />
      <h1 className="card-title">New Project</h1>
    </Link>
  );
}
