import { Chess, type Square } from "chess.js";
import studies from "../data/chess-puzzles.json";

export type PuzzleMove = {
  from: Square;
  to: Square;
  reply?: { from: Square; to: Square };
  next?: PuzzleMove[];
};
export type Puzzle = {
  id: string;
  mate: number;
  fen: string;
  moves: PuzzleMove[];
};
function transformSquare(square: Square, variant: number): Square {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]);
  return `${"abcdefgh"[variant & 1 ? 7 - file : file]}${variant & 2 ? 9 - rank : rank}` as Square;
}
function variantOf(study: Puzzle, variant: number): Puzzle {
  const source = new Chess(study.fen);
  const target = new Chess();
  target.clear();
  for (const row of source.board())
    for (const piece of row) {
      if (piece) target.put(piece, transformSquare(piece.square, variant));
    }
  function transformMoves(moves: PuzzleMove[]): PuzzleMove[] {
    return moves.map((move) => ({
      from: transformSquare(move.from, variant),
      to: transformSquare(move.to, variant),
      ...(move.reply
        ? {
            reply: {
              from: transformSquare(move.reply.from, variant),
              to: transformSquare(move.reply.to, variant),
            },
            next: transformMoves(move.next!),
          }
        : {}),
    }));
  }
  return {
    ...study,
    id: `${study.id}-${variant}`,
    fen: target.fen(),
    moves: transformMoves(study.moves),
  };
}
export const puzzles: Puzzle[] = (studies as Puzzle[]).flatMap((study) =>
  [0, 1, 2, 3].map((variant) => variantOf(study, variant)),
);
export function randomPuzzle(
  mate: number,
  currentId: string,
  random = Math.random,
): Puzzle {
  const choices = puzzles.filter((p) => p.mate === mate && p.id !== currentId);
  return choices[
    Math.min(choices.length - 1, Math.floor(random() * choices.length))
  ];
}
export function intro(puzzle: Puzzle) {
  return `White to move. Find checkmate in ${["", "one", "two", "three"][puzzle.mate]}.`;
}
