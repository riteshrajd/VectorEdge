'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="w-full max-w-sm space-y-4 rounded-lg bg-neutral-800 p-8 shadow-md text-center">
        <h1 className="text-2xl font-bold text-emerald-400">Verify Your Email</h1>
        <p className="text-sm text-neutral-300">
          A verification email has been sent to your inbox. Please check your email (including spam/junk) and click the link to verify your account.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}