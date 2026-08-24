import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Todo Pro",
    short_name: "Todo Pro",
    description: "A minimal todo app with animations, themes, and drag-to-reorder",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f7",
    theme_color: "#0066cc",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  };
}
