import { ToastProvider } from '@/components/Toast';
import dynamic from 'next/dynamic';

const Workbench = dynamic(() => import('@/components/Workbench'), {
  ssr: false,
});

export default function EditorPage() {
  return (
    <>
      <Workbench />
      <ToastProvider />
    </>
  );
}
