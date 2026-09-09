import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { puzzles, randomPuzzle, type PuzzleMove } from "../src/lib/puzzles";

describe("verified endgame puzzle collection", () => {
  it("offers four distinct positions at each difficulty and never repeats the current puzzle", () => {
    expect(new Set(puzzles.map((p) => p.fen)).size).toBe(12);
    for (const p of puzzles) {
      expect(puzzles.filter((other) => other.mate === p.mate)).toHaveLength(4);
      for (const random of [() => 0, () => 0.5, () => 0.9999]) {
        const next = randomPuzzle(p.mate, p.id, random);
        expect(next.id).not.toBe(p.id);
        expect(next.mate).toBe(p.mate);
      }
    }
  });
  for (const p of puzzles) {
    it(`${p.id}: every offered continuation is legal and finishes at the advertised depth`, () => {
      const game = new Chess(p.fen);
      expect(game.turn()).toBe("w");
      expect(game.isCheck()).toBe(false);
      function verify(lines: PuzzleMove[], remaining: number) {
        expect(lines.length).toBeGreaterThan(0);
        for (const move of lines) {
          expect(game.turn()).toBe("w");
          game.move(move);
          if (move.reply) {
            expect(remaining).toBeGreaterThan(1);
            expect(game.turn()).toBe("b");
            game.move(move.reply);
            verify(move.next!, remaining - 1);
            game.undo();
          } else {
            expect(remaining).toBe(1);
            expect(game.isCheckmate()).toBe(true);
          }
          game.undo();
        }
      }
      verify(p.moves, p.mate);
    });
  }
});
