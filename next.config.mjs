import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    SITE_URL: process.env.SITE_URL,
  },
  // Allow loading dev assets when opening the app via LAN IP (e.g. phone or Cursor preview).
  allowedDevOrigins: ["192.168.66.222"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
