'use client';

import { signup } from '@/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <form className="w-full max-w-sm space-y-4 rounded-lg bg-neutral-800 p-8 shadow-md">
        <h1 className="text-2xl font-bold text-emerald-400 text-center">Sign Up</h1>
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
        <button
          type="submit"
          formAction={signup}
          className="w-full rounded-md bg-emerald-600 py-2 px-4 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-neutral-300">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}