export default function Logo({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="64" height="64" rx="14" className="fill-apple-canvas" />
      <circle cx="32" cy="32" r="16" className="fill-apple-primary" />
      <path
        d="M24.5 32.5 29.2 37.2 40.5 25.5"
        stroke="#ffffff"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
