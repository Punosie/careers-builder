"use client";

import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="rounded-full border-red-500/60 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 hover:border-red-400 hover:bg-red-600/20 hover:text-red-300"
    >
      Logout
    </Button>
  );
}
