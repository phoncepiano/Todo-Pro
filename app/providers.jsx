"use client";

import PortraitOnly from "@/components/PortraitOnly";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <PortraitOnly>{children}</PortraitOnly>
    </ThemeProvider>
  );
}
