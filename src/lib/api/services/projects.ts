import { AxiosResponse } from 'axios';
import { axiosClient } from '../axios';

export type ProjectT = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  files?: FileT[];
};

export type FileT = {
  name: string;
  language: 'html' | 'css' | 'go' | 'js' | 'wasm';
  content: string;
  updated_at: string;
  created_at: string;
};

export const createProject = async ({
  name,
  description,
}: Pick<ProjectT, 'name' | 'description'>): Promise<ProjectT> => {
  const { data, status } = await axiosClient.post('/projects/', {
    name,
    description,
  });
  if (status !== 200) {
    return Promise.reject(data);
  }

  return data as ProjectT;
};

export const getProjects = async (): Promise<ProjectT[]> => {
  const { data, status } = await axiosClient.get<
    unknown,
    AxiosResponse<ProjectT[]>
  >('/projects');

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};

export const getProject = async (id: string): Promise<ProjectT> => {
  const { data, status } = await axiosClient.get(`/projects/${id}`);

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data as ProjectT;
};

export const saveProjectFiles = async ({
  id,
  files,
}: {
  id: string;
  files: FileT[];
}): Promise<FileT[]> => {
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

  return data as FileT[];
};

export const deleteProject = async (id: string): Promise<void> => {
  const { status } = await axiosClient.delete(`/projects/${id}`);

  if (status !== 204) {
    return Promise.reject();
  }
};
