"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyName }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sign up failed");

      router.push(`/${json.companySlug}/edit`);
    } catch (err: any) {
      console.error("Sign up error:", err);
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
      onSubmit={handleSignUp}
      className={cn("space-y-6", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-wide text-slate-300"
        >
          Work email
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
        <Label
          htmlFor="company-name"
          className="text-xs font-medium uppercase tracking-wide text-slate-300"
        >
          Company name
        </Label>
        <Input
          id="company-name"
          type="text"
          placeholder="Acme Inc."
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-wide text-slate-300"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <p className="text-[11px] text-slate-400">
          Use at least 8 characters with a mix of letters and numbers.
        </p>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="repeat-password"
          className="text-xs font-medium uppercase tracking-wide text-slate-300"
        >
          Confirm password
        </Label>
        <Input
          id="repeat-password"
          type="password"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <Button
        type="submit"
        className="w-full rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-sm font-semibold shadow-lg shadow-sky-700/40 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign up"}
      </Button>

      <div className="h-px bg-linear-to-r from-transparent via-slate-700/70 to-transparent" />

      <div className="text-center text-sm text-slate-300">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-sky-400 hover:text-sky-300"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
