'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/shadcn/ui/card";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 z-0 relative">
      
      {/* Background Image */}
      <div className="z-5">
        <Image
          src="/assets/images/login-page-images/abstract-light-speed-effect-black-background_107791-25835.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="fixed inset-0 brightness-[1] dark:brightness-[0.6] z-[-1]"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 h-[100vh] w-[100vw] z-6 bg-gradient-to-b from-blue-600/20 to-black/40 dark:to-black/10"></div>

      {/* Glassmorphism Card */}
      <Card className="overflow-hidden p-0 z-20 bg-white/4 dark:bg-white/2 backdrop-blur-xl border border-white/10 w-full max-w-md text-white">
        <CardContent className="grid p-6 md:p-8 gap-6 text-center">
          
          <div className="flex flex-col items-center gap-2">
            {/* Added a header for visual consistency with other pages */}
            <h1 className="text-2xl font-bold text-red-400">Oops!</h1>
            <p className="text-neutral-300 text-balance text-lg">
              Sorry, something went wrong.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 hover:cursor-pointer"
          >
            Go back to login
          </Link>
          
        </CardContent>
      </Card>
      
      {/* Footer Text */}
      <div className="text-neutral-300 text-shadow-black p-2 dark:text-shadow-none text-center text-xs z-20">
         <span className="opacity-60">© VectorEdge</span>
      </div>
    </div>
  );
}