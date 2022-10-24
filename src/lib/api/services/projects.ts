import { axiosClient } from '../axios';

export const createProject = async (name: string, description: string) => {
  const { data, status } = await axiosClient.post('/projects', {
    name,
    description,
  });
  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};
