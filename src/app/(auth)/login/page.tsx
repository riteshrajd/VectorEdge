import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <form className="w-full max-w-sm space-y-4 rounded-lg bg-neutral-800 p-8 shadow-md">
        <h1 className="text-2xl font-bold text-emerald-400 text-center">Welcome</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            formAction={login}
            className="w-full rounded-md bg-emerald-600 py-2 px-4 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          >
            Log in
          </button>
          <button
            type="submit"
            formAction={signup}
            className="w-full rounded-md border border-emerald-600 py-2 px-4 text-emerald-400 font-semibold hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
} 