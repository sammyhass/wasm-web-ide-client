import SEO from '@/components/seo';
import { Alert } from '@/components/Toast';
import { useLogin } from '@/hooks/api/useLogin';
import { useRegister } from '@/hooks/api/useRegister';
import { useMe, useMeQuery } from '@/hooks/useMe';
import { ApiErrorResponse } from '@/lib/api/axios';
import { LoginResponseT } from '@/lib/api/services/auth';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ZodError } from 'zod';
import { FormControl } from '../components/ui/FormControl';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<ZodError | string>('');

  const router = useRouter();
  const { refetch } = useMeQuery(false);

  const redirectTo = router.query.next as string | undefined;

  const { setJwt } = useMe();

  const onSuccess = useCallback(
    async (data: LoginResponseT) => {
      setJwt(data.jwt);

      await refetch();
      router.push(redirectTo ? decodeURIComponent(redirectTo) : '/projects');
    },
    [redirectTo, refetch, router, setJwt]
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
    onError: onError,
  });

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mode === 'register') {
        doRegister({ email, password, confirmPassword });
      } else if (mode === 'login') {
        doLogin({ email, password });
      }
    },
    [confirmPassword, doLogin, doRegister, mode, password, email]
  );

  return (
    <>
      <SEO title={mode === 'login' ? 'Login' : 'Register'} />
      <div className="max-w-lg mx-auto bg-base-200 shadow-md p-5 rounded-md my-10">
        <h1 className="text-4xl font-bold">
          {mode === 'login' ? 'Login' : 'Register'}
        </h1>
        <form className="flex flex-col gap-5 my-5" onSubmit={onSubmit}>
          <FormControl
            id="email"
            data-testid="email-input"
            label="Email"
            name="email"
            onChange={e => setEmail(e.target.value)}
          />
          <FormControl
            id="password"
            data-testid="password-input"
            label="Password"
            name="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          {mode === 'register' && (
            <FormControl
              id="confirmPassword"
              data-testid="confirm-password-input"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              onChange={e => setConfirmPassword(e.target.value)}
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
          data-testid={'toggle-mode'}
        >
          {mode === 'login'
            ? 'Need an account? Register here.'
            : 'Already have an account? Login here.'}
        </button>
        {!!error && (
          <div className="my-5" data-testid="error">
            <Alert
              type="error"
              message={
                error instanceof ZodError
                  ? `${error.errors[0]?.path}: ${error.errors[0]?.message}`
                  : error
              }
              id="failed-login"
              onHide={() => (error ? setError('') : null)}
            />
          </div>
        )}
      </div>
    </>
  );
}
