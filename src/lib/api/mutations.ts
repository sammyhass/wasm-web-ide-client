import { API_URL } from '@/lib/api/queryClient';
import { z } from 'zod';

const outputSchema = z.object({
  path: z.string(),
});

export const compileToWasm = async (code: string) => {
  if (!code) return Promise.reject('No go code found');
  const res = await fetch(`${API_URL}/wasm/compile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: code }),
  });

  if (!res.ok) {
    return Promise.reject(await res.text());
  }

  const json = await res.json();
  const output = outputSchema.parse(json);
  return output;
};
