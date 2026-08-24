import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Sign Up — Todo Pro",
  description: "Create your Todo Pro account",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start organizing with calm motion and elegant design."
    >
      <SignUpForm />
    </AuthShell>
  );
}
