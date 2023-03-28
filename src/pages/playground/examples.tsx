import SEO from '@/components/seo';

const EXAMPLES: {
  code: string;
  title: string;
  description: string;
}[] = [
  {
    description:
      'Using AssemblyScript to create and export a function to calculate the fibonacci sequence, and then calling it from JavaScript inside the browser.',
    title: 'AssemblyScript Fibonacci',
    code: '',
  },
  {
    description:
      'A simple example of a React component interacting with a WebAssembly module using AssemblyScript.',
    title: 'React + AssemblyScript',
    code: '25030ed0aae2',
  },
  {
    description:
      'Using the AssemblyScript standard library load/store operations to interact with memory using JavaScript and WebAssembly.',
    title: 'AssemblyScript Memory',
    code: '22c8de758e8c',
  },
];

function ExampleView(example: typeof EXAMPLES[number]) {
  return (
    <a
      href={`/playground${!!example.code ? `?code=${example.code}` : ''}`}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-bordered shadow-lg relative group"
    >
      <div className="card-body">
        <h2 className="card-title">{example.title}</h2>
        <p>{example.description}</p>
      </div>
    </a>
  );
}

export default function Examples() {
  return (
    <>
      <SEO title="Playground Examples" />
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Playground Examples</h1>
        <p className="text-lg text-base-400 mt-2">
          Here are some examples of what you can do with the WebContainers
          Playground.
        </p>
        <span className="text-base-400 text-sm bg-base-300 block p-2 rounded-md">
          <span className="badge badge-info">Recommended</span> Open playgrounds
          one at a time and try not to have more than one open at once. <br />{' '}
          This prevents the IDE from running out of its allocated memory.
        </span>
        <hr className="my-2" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map(example => (
            <ExampleView key={example.code} {...example} />
          ))}
        </div>
      </div>
    </>
  );
}
