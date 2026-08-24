"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifiedBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(searchParams.get("verified") === "1");
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="bg-apple-canvas border-b border-apple-hairline px-4 py-3 text-center">
      <p className="typography-body text-apple-primary">
        Email verified successfully. Welcome to Todo Pro.
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-3 text-apple-ink-muted-80 hover:text-apple-ink"
          aria-label="Dismiss"
        >
          ×
        </button>
      </p>
    </div>
  );
}
