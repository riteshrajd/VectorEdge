import { cn } from "@/lib/shadcn/utils"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { login } from "@/lib/actions/auth-actions"
import SignWithGoogleButton from "./SignWithGoogleButton"
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  return (
    // Using h-screen to ensure it fills the viewport
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full gap-6 z-0",
        className
      )}
      {...props}
    >
      <div className="z-5">
      <Image
        src="/assets/images/login-page-images/abstract-light-speed-effect-black-background_107791-25835.jpg"
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        className="fixed inset-0 brightness-[0.8] dark:brightness-[0.4] z-[-1]"
        priority
      />
      </div>
      <div className="fixed h-[100vh] w-[100vw] z-6 bg-gradient-to-b from-blue-600/20 to-black/10"></div>

      {/* 1. Added `text-white` to the Card for high contrast */}
      <Card className="overflow-hidden p-0 z-20 bg-white/4 dark:bg-white/2 backdrop-blur-xl border border-white/10 w-full max-w-md text-white">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                {/* 2. Used a lighter text color for the subtitle */}
                <p className="text-neutral-300 text-balance">
                  Login to your VectorEdge account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  // 3. Styled inputs to match the glass theme
                  className="bg-white/5 border-white/20 placeholder:text-neutral-400 focus:ring-offset-0"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline hover:text-primary"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6} // Add this line
                  title="Password must be at least 6 characters." // Optional: adds a helpful tooltip
                  className="bg-white/5 border-white/20 focus:ring-offset-0"
                />
              </div>
              <Button type="submit" className="w-full bg-neutral-200 text-neutral-800 hover:bg-neutral-300 hover:cursor-pointer" formAction={login}>
                Login
              </Button>
              {/* 4. Adjusted divider styles */}
              <div className="after:border-white/20 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-transparent text-neutral-300 relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="">
                <SignWithGoogleButton type="Login" />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4 font-semibold hover:text-neutral-200">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* 5. Ensured footer text is visible */}
      <div className="text-neutral-300 text-shadow dark:text-shadow-none *:[a]:hover:text-white text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 z-20">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}