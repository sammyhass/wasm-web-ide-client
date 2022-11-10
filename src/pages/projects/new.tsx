import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';
import { ApiErrorResponse } from '@/lib/api/axios';
import { createProject } from '@/lib/api/services/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse>();

  const router = useRouter();

  const client = useQueryClient();

  const { mutate } = useMutation(['createProject'], createProject, {
    onSuccess: () => {
      client.invalidateQueries(['projects']);
      router.push('/projects');
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
    const description = formData.get('description') as string;

    mutate({ name, description });

    router.push('/projects');
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
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea
              placeholder="Project Description"
              className="textarea h-24 textarea-bordered resize-none"
              id="description"
              name="description"
            />
          </div>
          <button className={`btn btn-primary ${loading ? 'loading' : ''}`}>
            Create Project
          </button>
        </form>
      </Container>
    </ProtectedPage>
  );
}
