import { useLogoutMutation, useMeQuery } from '@/hooks/useMe';
import Link from 'next/link';

export default function NavButtons() {
  const { data: user } = useMeQuery();

  const logout = useLogoutMutation();

  return (
    <div className="flex gap-2">
      <Link href="/playground">
        <button className="btn btn-outline btn-info btn-md">Playground</button>
      </Link>
      {user ? (
        <>
          <Link href="/projects">
            <button className="btn btn-outline btn-md">Your Projects</button>
          </Link>
          <button
            className="btn btn-error btn-outline btn-md"
            data-testid="logout-button"
            onClick={() => logout.mutate()}
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/login">
          <button className="btn btn-outline btn-md" data-testid="login-button">
            Login
          </button>
        </Link>
      )}
    </div>
  );
}
