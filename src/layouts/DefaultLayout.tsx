import Navbar from '@/components/Navbar';
// Default page layout used on all pages except editor pages.
export default function DefaultLayout(page: React.ReactNode) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
}
