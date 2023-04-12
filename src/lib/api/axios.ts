import { useMe } from '@/hooks/useMe';
import axios from 'axios';
import { z } from 'zod';

export type ApiErrorResponse = {
  error: string;
  info?: string[];
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiErrorSchema = z.object({
  error: z.string(),
  info: z.array(z.string()),
});

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use(
  config => {
    if (!config.headers) config.headers = {};
    const jwt = useMe.getState().jwt;
    if (jwt) {
      config.headers['Authorization'] = jwt ? `Bearer ${jwt}` : '';
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        useMe.setState({ jwt: null });
      }
      const { data } = error.response;
      const apiError = apiErrorSchema.parse(data);
      return Promise.reject(apiError);
    } else {
      return Promise.reject(error);
    }
  }
);
