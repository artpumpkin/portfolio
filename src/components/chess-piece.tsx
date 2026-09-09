/** Original vector silhouettes, shared proportions and reliable colors on every OS. */
export function ChessPiece({ kind, color }: { kind: string; color: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`chess-piece piece-${color}`}
    >
      <g
        fill={color === "w" ? "#fffcf0" : "#293a32"}
        stroke={color === "w" ? "#39483b" : "#f1ecda"}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {kind === "q" ? (
          <>
            <path d="M12 21 8 12l10 5 6-10 6 10 10-5-4 9-3 6H15Z" />
            {[8, 24, 40].map((x, i) => (
              <circle key={x} cx={x} cy={i === 1 ? 7 : 11} r="2.6" />
            ))}
            <path d="M16 27h16l-2 6 5 6H13l5-6Z" />
            <path d="M15 26h18v4H15Z" />
          </>
        ) : (
          <>
            <path d="M22 5h4v5h5v4h-5v6h-4v-6h-5v-4h5Z" />
            <path d="M14 20q10-9 20 0l-3 9H17Z" />
            <path d="M18 28h12l-1 6 6 5H13l6-5Z" />
            <path d="M16 27h16v4H16Z" />
          </>
        )}
        <path d="M13 38h22l3 5H10Z" />
      </g>
    </svg>
  );
}
