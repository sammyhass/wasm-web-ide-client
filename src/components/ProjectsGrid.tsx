import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type ProjectT = {
  name: string;
  createdAt: string;
};

export default function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NewProjectCard />
      {new Array(10).fill(0).map((_, i) => (
        <ProjectCard key={i} name={`Project ${i}`} createdAt={`2021-21-21`} />
      ))}
    </div>
  );
}

function ProjectCard({
  name = 'Project Name',
  createdAt = '2021-01-01',
}: ProjectT) {
  return (
    <div
      className="rounded-lg bg-base-100 cursor-pointer border hover:bg-base-200 shadow-lg transition-all duration-200 "
      tabIndex={0}
    >
      <div className="card-body">
        <h1 className="card-title">{name}</h1>
        <p className="text-base-content text-opacity-50">{createdAt}</p>
      </div>
    </div>
  );
}

function NewProjectCard() {
  return (
    <Link href={'/projects/new'} passHref>
      <a
        className="rounded-lg bg-base-100 cursor-pointer border hover:bg-base-200 shadow-lg transition-all duration-200 flex flex-col items-center justify-center  group
			"
        tabIndex={0}
      >
        <PlusIcon className="h-10 w-10" />
        <h1 className="card-title">New Project</h1>
      </a>
    </Link>
  );
}
