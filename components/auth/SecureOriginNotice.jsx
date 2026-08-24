"use client";

import { useEffect, useState } from "react";
import { isSecureAuthContext, getSiteOrigin } from "@/lib/auth";

export default function SecureOriginNotice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || isSecureAuthContext()) {
      return;
    }

    const localhostUrl = getSiteOrigin();
    setNotice(
      `For secure sign-in, open this app at ${localhostUrl} instead of your network IP.`
    );
  }, []);

  if (!notice) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center">
      <p className="typography-caption text-amber-900">{notice}</p>
    </div>
  );
}
