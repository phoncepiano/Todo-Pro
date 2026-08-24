import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow loading dev assets when opening the app via LAN IP (e.g. phone or Cursor preview).
  allowedDevOrigins: ["192.168.66.222"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
