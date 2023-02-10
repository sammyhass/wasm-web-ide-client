import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';
import { ApiErrorResponse } from '@/lib/api/axios';
import {
  createProject,
  projectLanguage,
  ProjectT,
} from '@/lib/api/services/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { z } from 'zod';

type LangT = z.input<typeof projectLanguage>;

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse>();

  const [selectedLang, setSelectedLang] = useState<LangT>('Go');
  const [name, setName] = useState('');

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

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      if (!!!name || !selectedLang) {
        return;
      }

      mutate({
        name,
        language: selectedLang,
      });
    },
    [mutate, name, selectedLang]
  );

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
              onChange={e => setName(e.target.value)}
              value={name}
              required
              name="name"
              data-testid="project-name-input"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select
              className="select select-bordered w-full"
              name="language"
              id="language"
              data-testid="project-language-select"
              onChange={e => setSelectedLang(e.target.value as LangT)}
            >
              <option value={'Go' as LangT}>Go</option>
              <option value={'AssemblyScript' as LangT}>AssemblyScript</option>
            </select>
          </div>
          <button
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            data-testid="create-project-button"
            type="submit"
          >
            Create Project
          </button>

          {error && (
            <div className="alert alert-error">
              <div className="alert-title">Error</div>
              <p>
                {error.info?.map((e, i) => (
                  <span key={i}>{e}</span>
                ))}
              </p>
            </div>
          )}
        </form>
      </Container>
    </ProtectedPage>
  );
}
