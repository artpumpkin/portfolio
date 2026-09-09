export function LachkarLogo() {
  return (
    <>
      <svg className="lachkar-symbol" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="1" y="1" width="46" height="46" rx="12" fill="#29372e" />
        <path
          d="M13 12h11v3h-4v20h11l4-8h3l-2 12H13v-3h3V15h-3Z"
          fill="#f3efdf"
        />
        <path d="m31 10 6 6-6 6-6-6Z" fill="#c68e69" />
      </svg>
      <span className="lachkar-name">
        lachkar<span className="lachkar-dot">.</span>
      </span>
    </>
  );
}
