"use client";

import PortraitOnly from "@/components/PortraitOnly";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortraitOnly>{children}</PortraitOnly>
      </AuthProvider>
    </ThemeProvider>
  );
}
