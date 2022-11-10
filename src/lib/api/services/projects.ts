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
