"use client";

import { Suspense } from "react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next") || "/";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Unable to login");
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#edf5df]">
      <Image src="/assets/loginImage.png" alt="Children in classroom" fill className="object-cover" priority />

      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-stretch px-0 py-0 ">
        <section className="flex min-h-screen rounded-r-3xl w-full max-w-[560px] items-center border-r border-white/70 bg-white/86 px-6 shadow-xl backdrop-blur-md md:px-10">
          <div className="w-full max-w-[430px] ">
           <div className="justify-center flex">
             <Image
              src="/assets/logoSSS.png"
              alt="Sprout School Suite"
              width={180}
              height={90}
              
              className="mb-8 h-auto w-[160px] md:w-[180px]"
              priority
            />
           </div>

            <h1 className="text-[52px] font-extrabold leading-none text-[#173f2f]">Welcome back!</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to access your dashboard</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <button type="button" className="font-medium text-[#2e7d32] hover:underline">
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="h-12 w-full bg-[#2f8f2f] text-white hover:bg-[#297d29]" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute top-[15%] z-10 hidden px-6 text-center lg:block" style={{ left: "560px", right: 0 }}>
        <h2 className="text-[60px] font-bold leading-[1.02] tracking-[-0.02em] text-[#173f2f]">
          Simplify. Organize. Grow.
        </h2>
        <p className="mt-4 text-[26px] leading-tight text-[#2f523f]">
          All-in-one management for daycare centers.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
