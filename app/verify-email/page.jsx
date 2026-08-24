import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import VerifyEmailPanel from "@/components/auth/VerifyEmailPanel";

export const metadata = {
  title: "Verify Email — Todo Pro",
  description: "Verify your Todo Pro account email address",
};

function VerifyEmailFallback() {
  return (
    <div className="typography-body text-apple-ink-muted-80 text-center">
      Loading verification details…
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify your email"
      subtitle="One quick step before you can start using Todo Pro."
    >
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailPanel />
      </Suspense>
    </AuthShell>
  );
}
