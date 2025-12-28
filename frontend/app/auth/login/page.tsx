// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/login-form";
import { AuthLayout } from "../components/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to view your pipelines, teams, and live metrics in one unified workspace."
    >
      <LoginForm />
    </AuthLayout>
  );
}
