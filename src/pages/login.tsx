import { Alert } from '@/components/Toast';
import { useLogin } from '@/hooks/api/useLogin';
import { useRegister } from '@/hooks/api/useRegister';
import { useMe, useMeQuery } from '@/hooks/useMe';
import { ApiErrorResponse } from '@/lib/api/axios';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ZodError } from 'zod';
import { FormControl } from '../components/ui/FormControl';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [error, setError] = useState<ZodError | string>('');

  const router = useRouter();
  const setJwt = useMe(s => s.setJwt);
  const { refetch } = useMeQuery(false);

  const onSuccess = useCallback(
    async (data: { token: string }) => {
      setJwt(data.token);
      await refetch();
      router.push('/projects');
    },
    [setJwt, refetch, router]
  );

  const onError = (error: ApiErrorResponse | ZodError) => {
    if (error instanceof ZodError) {
      setError(error);
    } else {
      setError(error.info?.join(',') || error?.error || 'Unknown error');
    }
  };

  const { mutate: doLogin, isLoading: loginLoading } = useLogin({
    onSuccess,
    onError: onError,
  });
  const { mutate: doRegister, isLoading: registerLoading } = useRegister({
    onSuccess,
    onError: e => {
      onError(e);
    },
  });

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const username = formData.get('username') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (mode === 'register') {
        doRegister(username, password, confirmPassword);
      } else if (mode === 'login') {
        doLogin(username, password);
      }
    },
    [doLogin, doRegister, mode]
  );

  return (
    <div className="max-w-lg mx-auto bg-base-200 shadow-md p-5 rounded-md my-10">
      <h1 className="text-4xl font-bold">
        {mode === 'login' ? 'Login' : 'Register'}
      </h1>
      <form className="flex flex-col gap-5 my-5 font-mono " onSubmit={onSubmit}>
        <FormControl id="username" label="Username" name="username" />
        <FormControl
          id="password"
          label="Password"
          name="password"
          type="password"
        />
        {mode === 'register' && (
          <FormControl
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          />
        )}
        <button
          className={`btn btn-primary
          ${loginLoading || registerLoading ? 'loading' : ''} 
        `}
          type="submit"
          disabled={loginLoading || registerLoading}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        onClick={() => setMode(m => (m === 'login' ? 'register' : 'login'))}
        className={`btn btn-accent w-full btn-sm normal-case`}
      >
        {mode === 'login'
          ? 'Need an account? Register here.'
          : 'Already have an account? Login here.'}
      </button>
      {!!error && (
        <div className="my-5">
          <Alert
            type="error"
            message={
              typeof error === 'object'
                ? error.format()._errors.join(', ')
                : error
            }
            id="failed-login"
            onHide={() => (error ? setError('') : null)}
          />
        </div>
      )}
    </div>
  );
}
