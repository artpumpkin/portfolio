import { writeFileSync } from "node:fs";
import { Chess } from "chess.js";
const cache = new Map();
let nodes = 0;
function win(g, d) {
  const key = g.fen().split(" ").slice(0, 2).join(" ") + " " + d;
  if (cache.has(key)) return cache.get(key);
  const moves = g.moves({ verbose: true });
  if (!moves.length) return g.isCheck() && g.turn() === "b";
  if (d === 0) return false;
  let result = g.turn() === "b";
  for (const m of moves) {
    g.move(m);
    const w = win(g, d - 1);
    g.undo();
    if (g.turn() === "w" && w) {
      result = true;
      break;
    }
    if (g.turn() === "b" && !w) {
      result = false;
      break;
    }
  }
  cache.set(key, result);
  nodes++;
  return result;
}

function tree(g, d) {
  const moves = [];
  for (const m of g.moves({ verbose: true })) {
    g.move(m);
    if (win(g, d - 1)) {
      const item = { from: m.from, to: m.to };
      if (!g.isCheckmate()) {
        const replies = g.moves({ verbose: true });
        let best = replies[0],
          longest = -1;
        for (const r of replies) {
          g.move(r);
          let distance = 1;
          while (distance < d - 1 && !win(g, distance)) distance += 2;
          g.undo();
          if (distance > longest) {
            longest = distance;
            best = r;
          }
        }
        item.reply = { from: best.from, to: best.to };
        g.move(best);
        item.next = tree(g, d - 2);
        g.undo();
      }
      moves.push(item);
    }
    g.undo();
  }
  return moves;
}
const bases = [
  { id: "corner", mate: 1, fen: "6k1/8/6KQ/8/8/8/8/8 w - - 0 1" },
  { id: "coordination", mate: 2, fen: "7k/8/5K2/8/4Q3/8/8/8 w - - 0 1" },
  { id: "quiet-approach", mate: 3, fen: "7k/8/8/4K3/4Q3/8/8/8 w - - 0 1" },
];
for (const p of bases) {
  const g = new Chess(p.fen);
  if (!win(g, p.mate * 2 - 1) || (p.mate > 1 && win(g, p.mate * 2 - 3)))
    throw Error("Incorrect mate distance");
  p.moves = tree(g, p.mate * 2 - 1);
  console.log(p.id, JSON.stringify(p).length);
}
writeFileSync(
  new URL("../src/data/chess-puzzles.json", import.meta.url),
  JSON.stringify(bases, null, 2) + "\n",
);
