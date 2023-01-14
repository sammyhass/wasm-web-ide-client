import { AxiosResponse } from 'axios';
import { z } from 'zod';
import { axiosClient } from '../axios';

const languageSchema = z.union([
  z.literal('html'),
  z.literal('css'),
  z.literal('go'),
  z.literal('js'),
]);

const fileSchema = z.object({
  name: z.string(),
  language: languageSchema,
  content: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  files: z.array(fileSchema).optional(),
});

export type ProjectT = z.output<typeof projectSchema>;
export type FileT = z.output<typeof fileSchema>;

const parseId = (id: string) => z.string().uuid().parse(id);

export const createProject = async ({
  name,
}: Pick<ProjectT, 'name'>): Promise<ProjectT> => {
  const { data, status } = await axiosClient.post('/projects', {
    name,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};

const projectsArraySchema = z.array(projectSchema);
export const getProjects = async (): Promise<ProjectT[]> => {
  const { data, status } = await axiosClient.get<
    unknown,
    AxiosResponse<ProjectT[]>
  >('/projects');

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectsArraySchema.parse(data);
};

export const getProject = async (id: string): Promise<ProjectT> => {
  parseId(id);

  const { data, status } = await axiosClient.get(`/projects/${id}`);

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};

export const saveProjectFiles = async ({
  id,
  files,
}: {
  id: string;
  files: FileT[];
}): Promise<FileT[]> => {
  parseId(id);

  const filesAcc = files?.reduce((acc, curr) => {
    acc[curr.name] = curr.content;
    return acc;
  }, {} as { [key: string]: string });

  const { data, status } = await axiosClient.patch(`/projects/${id}`, {
    files: filesAcc,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return z.array(fileSchema).parse(data);
};

export const deleteProject = async (id: string): Promise<void> => {
  const { status } = await axiosClient.delete(`/projects/${id}`);

  if (status !== 200) {
    return Promise.reject();
  }

  return;
};

export const compileProject = async (id: string): Promise<string> => {
  parseId(id);

  const { status, data } = await axiosClient.post<string>(
    `/projects/${id}/compile`
  );

  if (status !== 200) {
    return Promise.reject(data);
  }

  return z.string().parse(data);
};
