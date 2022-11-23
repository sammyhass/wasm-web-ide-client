import { useMe } from '@/hooks/useMe';
import dynamic from 'next/dynamic';
import Link from 'next/link';

function ProtectedPage(props: React.PropsWithChildren<unknown>) {
  const { user } = useMe();

  return user ? (
    <>{props.children}</>
  ) : (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-base-200 p-10 rounded-lg shadow-lg max-w-xl mx-auto gap-10 flex-col flex items-center">
        <h1 className="text-4xl font-bold">
          You must be logged in to view this page
        </h1>
        <Link href="/login">
          <button className="btn btn-primary min-w-[200px] btn-lg">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ProtectedPage), {
  ssr: false,
});
