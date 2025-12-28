"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      router.push("/protected");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "h-10 rounded-xl border-slate-700/70 bg-slate-900/70 text-sm text-slate-50 " +
    "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-slate-500/20 bg-slate-900/40 shadow-xl shadow-slate-950/60 backdrop-blur-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-50">
            Reset your password
          </CardTitle>
          <CardDescription className="text-sm text-slate-300/80">
            Choose a strong password you do not use elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                New password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <p className="text-[11px] text-slate-400">
                Minimum 8 characters. Avoid reusing old passwords.
              </p>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-sm font-semibold shadow-lg shadow-sky-700/40 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save new password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
