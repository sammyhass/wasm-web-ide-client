import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';
import { ApiErrorResponse } from '@/lib/api/axios';
import { createProject, ProjectT } from '@/lib/api/services/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse>();

  const router = useRouter();

  const client = useQueryClient();

  const { mutate } = useMutation(['createProject'], createProject, {
    onSuccess: d => {
      client.setQueryData<ProjectT[]>(['projects'], prev => {
        if (prev) {
          return [...prev, d];
        } else {
          return [d];
        }
      });

      client.setQueryData<ProjectT>(['project', d.id], d);
      setLoading(false);

      router.push(`/projects/${d.id}`);
    },
    onError: err => {
      setError(err as ApiErrorResponse);
      setLoading(false);
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;

    mutate({ name });
  };

  return (
    <ProtectedPage>
      <Container title={'New Project'}>
        <form
          className="flex flex-col gap-4 max-w-xl mx-auto"
          onSubmit={onSubmit}
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Project Name"
              className="input input-bordered"
              id="name"
              required
              name="name"
              data-testid="project-name-input"
            />
          </div>
          <button
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            data-testid="create-project-button"
            type="submit"
          >
            Create Project
          </button>
        </form>
      </Container>
    </ProtectedPage>
  );
}
