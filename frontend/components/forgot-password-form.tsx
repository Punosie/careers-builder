"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "h-10 rounded-xl border-slate-700/70 bg-slate-900/40 text-sm text-slate-50 " +
    "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  if (success) {
    // Outer layout already shows heading/description; only small success hint.
    return (
      <div className={cn("text-sm text-slate-300", className)}>
        <p>
          If an account exists for{" "}
          <span className="font-medium text-slate-50">{email}</span>, a reset
          link has been sent to your inbox.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Did not get the email? Check your spam folder or try again with a
          different address.
        </p>
        <div className="mt-4 text-sm">
          <Link
            href="/auth/login"
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleForgotPassword}
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

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <Button
        type="submit"
        className="w-full rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-sm font-semibold shadow-lg shadow-sky-700/40 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send reset email"}
      </Button>

      <div className="h-px bg-linear-to-r from-transparent via-slate-700/70 to-transparent" />

      <div className="mt-1 text-center text-sm text-slate-300">
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
