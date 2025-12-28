// app/(auth)/sign-up/page.tsx
import { SignUpForm } from "@/components/sign-up-form";
import { AuthLayout } from "../components/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Spin up a new organization in seconds. Invite your team and start shipping faster together."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
