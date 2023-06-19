import { useLogoutMutation, useMe, useMeQuery } from "@/hooks/useMe";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

function ProtectedPage(props: React.PropsWithChildren<unknown>) {
  const { data, isLoading } = useMeQuery();
  const jwt = useMe((s) => s.jwt);
  const { mutate: logout } = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    if ((!isLoading && !data?.id) || !jwt) {
      logout();
      router.push("/login");
    }
  }, [data, isLoading, jwt, logout, router]);

  return data?.id ? (
    <>{props.children}</>
  ) : (
    <>
      <div className="mt-20 flex flex-col items-center justify-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-10 rounded-lg bg-base-200 p-10 shadow-lg">
          <h1 className="text-4xl font-bold">
            You must be logged in to view this page
          </h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Link href="/login">
              <button className="btn btn-primary btn-lg min-w-[200px]">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(ProtectedPage), {
  ssr: false,
});
