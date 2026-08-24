function getInitials(profile) {
  const fullName = profile?.full_name?.trim();
  if (fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  const email = profile?.email?.trim();
  if (email) {
    return email[0].toUpperCase();
  }

  return "?";
}

function getDisplayName(profile) {
  const fullName = profile?.full_name?.trim();
  if (fullName) return fullName;

  const email = profile?.email?.trim();
  if (email) return email;

  return "Account";
}

export default function UserAvatar({ profile, className = "" }) {
  const initials = getInitials(profile);
  const displayName = getDisplayName(profile);

  return (
    <span
      aria-label={displayName}
      title={displayName}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-apple-hairline bg-apple-primary/10 text-[11px] font-semibold uppercase tracking-wide text-apple-primary ${className}`.trim()}
    >
      {initials}
    </span>
  );
}
