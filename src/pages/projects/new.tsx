import Container from '@/layouts/Container';
import ProtectedPage from '@/layouts/ProtectedPage';

export default function NewProjectPage() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
  };

  return (
    <ProtectedPage>
      <Container title={'New Project'}>
        <form
          className="flex flex-col gap-4 max-w-xl mx-auto"
          onSubmit={onSubmit}
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Project Name"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea
              placeholder="Project Description"
              className="textarea h-24 textarea-bordered resize-none"
            />
          </div>
          <button className="btn btn-primary">Create Project</button>
        </form>
      </Container>
    </ProtectedPage>
  );
}
