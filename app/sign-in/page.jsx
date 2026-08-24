import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign In — Todo Pro",
  description: "Sign in to your Todo Pro account",
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to Todo Pro"
      subtitle="Welcome back. Pick up right where you left off."
    >
      <SignInForm />
    </AuthShell>
  );
}
