// app/(auth)/forgot-password/page.tsx
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthLayout } from "../components/auth-layout";

export default function Page() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email you used to sign up. A secure reset link will be sent if an account exists."
    >
      <ForgotPasswordForm />
      <p className="mt-4 text-xs text-slate-300/80">
        For security, password reset links expire after 15 minutes. If you did
        not request this, you can ignore the email.
      </p>
    </AuthLayout>
  );
}
