'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/shadcn/ui/card";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, [router]);

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
      <Card className="overflow-hidden p-0 z-20 bg-white/4 dark:bg-white/2 backdrop-blur-xl border border-white/10 w-full max-w-sm text-white">
        <CardContent className="grid p-8 gap-6 text-center">
          
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Logged Out</h1>
            
            {/* Loading Spinner */}
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-400 border-t-white" />
            
            <p className="text-neutral-300 text-balance text-sm">
              You have successfully logged out.<br/>
              Redirecting you to the home page...
            </p>
          </div>

        </CardContent>
      </Card>
      
      {/* Footer Text */}
      <div className="text-neutral-300 text-shadow-black p-2 dark:text-shadow-none text-center text-xs z-20">
         <span className="opacity-60">© VectorEdge</span>
      </div>
    </div>
  );
};

export default LogoutPage;