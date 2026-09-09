import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import {
  INITIAL_FEN,
  SOLUTION,
  attemptMove,
  legalTargets,
  squares,
} from "../src/lib/chess";
describe("mate-in-one puzzle", () => {
  it("starts in a legal, non-check position with white to move", () => {
    const g = new Chess(INITIAL_FEN);
    expect(g.turn()).toBe("w");
    expect(g.isCheck()).toBe(false);
    expect(g.isGameOver()).toBe(false);
  });
  it("accepts the advertised solution as checkmate", () => {
    const move = attemptMove(INITIAL_FEN, SOLUTION.from, SOLUTION.to);
    expect(move?.solved).toBe(true);
    expect(move?.san).toBe("Qg7#");
  });
  it("rejects an illegal move without changing the puzzle", () => {
    expect(attemptMove(INITIAL_FEN, "h6", "f5")).toBeNull();
    expect(new Chess(INITIAL_FEN).get("h6")?.type).toBe("q");
  });
  it("distinguishes a legal non-mating move", () => {
    expect(attemptMove(INITIAL_FEN, "h6", "h5")?.solved).toBe(false);
  });
  it("highlights legal squares and excludes occupied or unsafe squares", () => {
    expect(legalTargets(INITIAL_FEN, "h6")).toContain("g7");
    expect(legalTargets(INITIAL_FEN, "h6")).not.toContain("g6");
    expect(legalTargets(INITIAL_FEN, "g6")).not.toContain("g7");
  });
  it("maps all 64 unique squares in display order", () => {
    expect(new Set(squares).size).toBe(64);
    expect(squares[0]).toBe("a8");
    expect(squares[63]).toBe("h1");
  });
});
