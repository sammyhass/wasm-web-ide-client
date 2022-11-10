import { ProjectT } from '@/lib/api/services/projects';
import { PlusIcon } from '@heroicons/react/24/solid';
import { formatRelative } from 'date-fns';
import Link from 'next/link';

export default function ProjectsGrid(props: {
  projects?: ProjectT[];
  loading: boolean;
}) {
  if (props.loading) {
    return (
      <div className="text-center flex justify-center">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NewProjectCard />
      {props.projects?.map((p, i) => (
        <ProjectCard key={i} {...p} />
      ))}
    </div>
  );
}

function ProjectCard({ id, name, created_at }: ProjectT) {
  return (
    <Link
      href={`/projects/${id}`}
      className="p-10 rounded-lg bg-base-100 cursor-pointer border hover:bg-base-200 shadow-lg transition-all duration-200"
    >
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-base-content text-opacity-50">
        Created {formatRelative(new Date(created_at), Date.now())}
      </p>
    </Link>
  );
}

function NewProjectCard() {
  return (
    <Link
      href={'/projects/new'}
      passHref
      className="rounded-lg bg-base-100 cursor-pointer border hover:bg-base-200 shadow-lg transition-all duration-200 flex flex-col items-center justify-center group h-60"
      tabIndex={0}
    >
      <PlusIcon className="h-10 w-10" />
      <h1 className="card-title">New Project</h1>
    </Link>
  );
}
