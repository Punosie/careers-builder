"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");

      router.push(`/${json.companySlug}/edit`);
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "h-10 rounded-xl border-slate-700/70 bg-slate-900/70 text-sm text-slate-50 " +
    "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  return (
    <form
      onSubmit={handleLogin}
      className={cn("space-y-6", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-wide text-slate-300"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label
            htmlFor="password"
            className="text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="ml-auto text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <Button
        type="submit"
        className="w-full rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-sm font-semibold shadow-lg shadow-sky-700/40 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-xs text-slate-400">
        By continuing you agree to our{" "}
        <span className="cursor-pointer text-sky-400 hover:text-sky-300">
          Terms
        </span>{" "}
        and{" "}
        <span className="cursor-pointer text-sky-400 hover:text-sky-300">
          Privacy Policy
        </span>
        .
      </p>

      <div className="h-px bg-linear-to-r from-transparent via-slate-700/70 to-transparent" />

      <div className="text-center text-sm text-slate-300">
        Do not have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-sky-400 hover:text-sky-300"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
