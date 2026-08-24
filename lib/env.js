function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseUrl() {
  return requireEnv("SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return requireEnv("SUPABASE_PUBLISHABLE_KEY");
}

export function getSiteUrl() {
  return requireEnv("SITE_URL").replace(/\/$/, "");
}
