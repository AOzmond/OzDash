export function ThermometerIcon() {
  return (
    <svg
      className="temperature-icon"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Indoor temperature"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M26 37.5V13a6 6 0 0 1 12 0v24.5a12 12 0 1 1-12 0Z" />
      <path d="M32 24v22" />
      <circle cx="32" cy="47" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}
