// Playground Page using WebContainers to provide a sandboxed environment

import Navbar from '@/components/Navbar';
import PlaygroundEditor from '@/components/playground/PlaygroundEditor';

function PlaygroundPage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PlaygroundEditor />
    </div>
  );
}

PlaygroundPage.getLayout = (page: React.ReactNode) => {
  return <>{page}</>;
};

export default PlaygroundPage;
