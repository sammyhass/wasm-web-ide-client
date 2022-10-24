import { z } from 'zod';
import { axiosClient } from '../axios';

const outputSchema = z.object({
  path: z.string(),
});
export const compileToWasm = async (code: string) => {
  if (!code) return Promise.reject('No go code found');
  const res = await axiosClient.post('/wasm/compile', { code });

  if (res.status !== 200) {
    return Promise.reject(res.data);
  }

  const data = outputSchema.parse(res.data);

  return data;
};
