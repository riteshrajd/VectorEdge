'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="text-center space-y-4 rounded-lg bg-neutral-800 p-8 shadow-md">
        <p className="text-lg text-neutral-300">
          Sorry, something went wrong.
        </p>
        <button
          className="rounded-md bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
           <Link href="/login" className="transition-colors">
            Go back to login
          </Link>
        </button>
      </div>
    </div>
  );
}