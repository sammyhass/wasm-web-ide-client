import { useState } from 'react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="max-w-lg mx-auto bg-base-200 shadow-md p-5 rounded-md my-10">
      <h1 className="text-4xl font-bold">
        {mode === 'login' ? 'Login' : 'Register'}
      </h1>
      <form className="flex flex-col gap-5 my-5 ">
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input"
            id="email"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input"
            id="password"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
      <button
        onClick={() => setMode(m => (m === 'login' ? 'register' : 'login'))}
        className="btn btn-accent w-full btn-sm normal-case"
      >
        {mode === 'login'
          ? 'Need an account? Register here.'
          : 'Already have an account? Login here.'}
      </button>
    </div>
  );
}
