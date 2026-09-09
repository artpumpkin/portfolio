import { Chess, type Square } from "chess.js";
export const INITIAL_FEN = "6k1/8/6KQ/8/8/8/8/8 w - - 0 1";
export const SOLUTION = { from: "h6", to: "g7" } as const;
export const squares: Square[] = Array.from(
  { length: 64 },
  (_, i) => `${"abcdefgh"[i % 8]}${8 - Math.floor(i / 8)}` as Square,
);
export function legalTargets(fen: string, from: Square): Square[] {
  return new Chess(fen).moves({ square: from, verbose: true }).map((m) => m.to);
}
export function attemptMove(fen: string, from: Square, to: Square) {
  const game = new Chess(fen);
  try {
    const move = game.move({ from, to, promotion: "q" });
    return { fen: game.fen(), solved: game.isCheckmate(), san: move.san };
  } catch {
    return null;
  }
}
