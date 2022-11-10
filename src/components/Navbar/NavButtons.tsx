import { useMe, useMeQuery } from '@/hooks/useMe';
import Link from 'next/link';
import shallow from 'zustand/shallow';

export default function NavButtons() {
  const { user, setJwt } = useMe(
    s => ({
      setJwt: s.setJwt,
      user: s.user,
    }),
    shallow
  );
  const { refetch } = useMeQuery(false);

  return (
    <div className="flex gap-2">
      {user ? (
        <>
          <Link href="/projects">
            <button className="btn btn-outline btn-md">Your Projects</button>
          </Link>
          <button
            className="btn btn-error btn-outline btn-md"
            onClick={() => {
              setJwt(null);
              refetch();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/login">
          <button className="btn btn-outline btn-md">Login</button>
        </Link>
      )}
    </div>
  );
}
