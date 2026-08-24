function missingEnv(name) {
  throw new Error(`Missing required environment variable: ${name}`);
}

export function getSupabaseUrl() {
  const value = process.env.SUPABASE_URL;
  if (!value) missingEnv("SUPABASE_URL");
  return value;
}

export function getSupabasePublishableKey() {
  const value = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!value) missingEnv("SUPABASE_PUBLISHABLE_KEY");
  return value;
}

export function getSiteUrl() {
  const value = process.env.SITE_URL;
  if (!value) missingEnv("SITE_URL");
  return value.replace(/\/$/, "");
}
