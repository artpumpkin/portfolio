"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Chess, type Square } from "chess.js";
import {
  RotateCcw,
  Lightbulb,
  ArrowUpRight,
  Grid2X2,
  Box,
  Check,
  Shuffle,
} from "lucide-react";
import { INITIAL_FEN, attemptMove, legalTargets, squares } from "@/lib/chess";
import { ChessPiece } from "./chess-piece";
import {
  puzzles,
  randomPuzzle,
  intro,
  type Puzzle,
  type PuzzleMove,
} from "@/lib/puzzles";
const Scene = dynamic(() => import("./chess-scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
const subscribeViewport = (callback: () => void) => {
  const query = matchMedia("(max-width: 700px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const mobileSnapshot = () => matchMedia("(max-width: 700px)").matches;
const serverSnapshot = () => false;
const names: Record<string, string> = { k: "king", q: "queen" };
export function ChessPuzzle() {
  const [puzzle, setPuzzle] = useState(puzzles[0]),
    [lines, setLines] = useState<PuzzleMove[]>(puzzles[0].moves),
    [failed, setFailed] = useState(false),
    [pending, setPending] = useState<PuzzleMove | null>(null),
    [remaining, setRemaining] = useState(1),
    [history, setHistory] = useState<string[]>([]),
    [fen, setFen] = useState(INITIAL_FEN),
    [selected, setSelected] = useState<Square | null>(null),
    [message, setMessage] = useState("White to move. Find checkmate in one."),
    [solved, setSolved] = useState(false),
    [view, setView] = useState<"2d" | "3d" | null>(null),
    [exploring, setExploring] = useState(false),
    [ready, setReady] = useState(false),
    [sceneReady, setSceneReady] = useState(false),
    [active, setActive] = useState(false),
    [celebrating, setCelebrating] = useState(false);
  const mobile = useSyncExternalStore(
    subscribeViewport,
    mobileSnapshot,
    serverSnapshot,
  );
  const flat = view === "2d" || (view === null && mobile);
  const setFlat = (value: boolean) => {
    setView(value ? "2d" : "3d");
    setExploring(false);
  };
  const root = useRef<HTMLDivElement>(null),
    game = new Chess(fen),
    targets =
      selected && !failed && !solved && !pending
        ? legalTargets(fen, selected)
        : [],
    attempted = failed || solved;
  useEffect(() => {
    const element = root.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting && !document.hidden);
      },
      { rootMargin: "80px" },
    );
    if (element) observer.observe(element);
    const visibility = () =>
      setActive(
        !document.hidden &&
          !!element &&
          element.getBoundingClientRect().bottom > 0 &&
          element.getBoundingClientRect().top < innerHeight,
      );
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrating(false), 2200);
    return () => clearTimeout(timer);
  }, [celebrating]);
  useEffect(() => {
    if (!ready || flat || sceneReady) return;
    const timer = setTimeout(() => {
      setView("2d");
      setMessage("3D is taking a while. You can play the same puzzle in 2D.");
    }, 10000);
    return () => clearTimeout(timer);
  }, [ready, flat, sceneReady]);
  const revealScene = useCallback(() => setSceneReady(true), []);
  function activate() {
    if (ready && !flat) return;
    setSceneReady(false);
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      if (!context) setFlat(true);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setFlat(true);
    }
    setReady(true);
  }
  useEffect(() => {
    if (!pending?.reply) return;
    const timer = setTimeout(() => {
      const position = new Chess(fen);
      const response = position.move(pending.reply!);
      setFen(position.fen());
      setLines(pending.next!);
      setRemaining((n) => n - 1);
      setHistory((moves) => [...moves, response.san]);
      setPending(null);
      setMessage(
        `Black plays ${response.san}. Your turn — mate in ${remaining - 1}.`,
      );
    }, 650);
    return () => clearTimeout(timer);
  }, [pending, fen, remaining]);
  function loadPuzzle(next: Puzzle) {
    setExploring(false);
    setPuzzle(next);
    setLines(next.moves);
    setFen(next.fen);
    setSelected(null);
    setSolved(false);
    setFailed(false);
    setPending(null);
    setRemaining(next.mate);
    setHistory([]);
    setCelebrating(false);
    setMessage(intro(next));
  }
  function reset() {
    loadPuzzle(puzzle);
  }
  function nextPuzzle(mate = puzzle.mate) {
    loadPuzzle(randomPuzzle(mate, puzzle.id));
    setExploring(false);
  }
  function choose(square: Square) {
    if (attempted || pending || exploring) return;
    const piece = game.get(square);
    if (piece?.color === "w") {
      setSelected(square);
      setMessage(
        `${names[piece.type]} on ${square} selected. Choose a highlighted square.`,
      );
      return;
    }
    if (!selected) {
      setMessage("Select a white piece first.");
      return;
    }
    const result = attemptMove(fen, selected, square);
    if (!result) {
      setMessage("That move is not legal. Try a highlighted square.");
      return;
    }
    const continuation = lines.find(
      (move) => move.from === selected && move.to === square,
    );
    setFen(result.fen);
    setSelected(null);
    setHistory((moves) => [...moves, result.san]);
    if (result.solved) {
      setSolved(true);
      setCelebrating(!matchMedia("(prefers-reduced-motion: reduce)").matches);
      setMessage("Checkmate. A well-considered move!");
    } else if (continuation?.reply) {
      setPending(continuation);
      setMessage(`${result.san} — good move. Black is responding…`);
    } else {
      setFailed(true);
      setMessage(
        `${result.san} is legal, but ${puzzle.mate === 1 ? "not checkmate" : "it misses the forced mate"}. Choose Try again to reset the puzzle.`,
      );
    }
  }
  const board = (
    <div
      className="flat-board"
      role="group"
      aria-label={
        attempted
          ? "Chessboard. Move played. Reset to try the puzzle again."
          : pending
            ? "Chessboard. Black is responding. Please wait for your turn."
            : "Chessboard. White to move. Use arrow keys to navigate squares."
      }
    >
      {squares.map((s, i) => {
        const piece = game.get(s);
        return (
          <button
            key={s}
            data-square={s}
            className={`square ${(i + Math.floor(i / 8)) % 2 ? "dark" : "light"} ${selected === s ? "selected" : ""} ${targets.includes(s) ? "legal" : ""}`}
            aria-label={`${s}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${names[piece.type]}` : ""}${targets.includes(s) ? ", legal move" : ""}`}
            aria-pressed={selected === s}
            onClick={() => choose(s)}
            onKeyDown={(e) => {
              const delta = {
                ArrowRight: 1,
                ArrowLeft: -1,
                ArrowDown: 8,
                ArrowUp: -8,
              }[e.key];
              if (delta !== undefined) {
                e.preventDefault();
                const next = Math.max(0, Math.min(63, i + delta));
                root.current
                  ?.querySelector<HTMLButtonElement>(
                    `[data-square="${squares[next]}"]`,
                  )
                  ?.focus();
              }
            }}
          >
            {piece && <ChessPiece kind={piece.type} color={piece.color} />}
            {!piece && targets.includes(s) && (
              <i className="move-dot" aria-hidden="true" />
            )}
            {i % 8 === 0 && (
              <span className="rank-label" aria-hidden="true">
                {s[1]}
              </span>
            )}
            {i >= 56 && (
              <span className="file-label" aria-hidden="true">
                {s[0]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
  return (
    <div
      className={`chess-card ${view === null ? "auto-view" : ""}`}
      ref={root}
    >
      <div className="chess-overline">
        <span>
          <i /> THE PLAYGROUND
        </span>
        <span>CHESS / 01</span>
      </div>
      <div className="chess-heading">
        <h2>
          A little strategy. <em>A little play.</em>
        </h2>
        <p>Find the finish. I’ll play Black.</p>
      </div>
      <div className="chess-toolbar">
        <div
          className="difficulty-switch"
          role="group"
          aria-label="Puzzle difficulty"
        >
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              aria-pressed={puzzle.mate === n}
              onClick={() => nextPuzzle(n)}
            >
              Mate in {n}
            </button>
          ))}
        </div>
        <div className="view-switch" role="group" aria-label="Board view">
          <button
            aria-label="Keyboard / 2D"
            aria-pressed={flat}
            onClick={() => setFlat(true)}
          >
            <Grid2X2 size={14} /> 2D
          </button>
          <button
            aria-label="3D view"
            aria-pressed={!flat}
            onClick={() => {
              if (flat) {
                setFlat(false);
                activate();
              }
            }}
          >
            <Box size={14} /> 3D
          </button>
        </div>
      </div>
      <div className="board-context">
        <span>White to move</span>
        <span>{solved ? "Puzzle solved" : `Mate in ${remaining}`}</span>
      </div>
      <div
        className={`scene-wrap ${flat ? "is-flat" : ""} ${exploring ? "is-exploring" : ""}`}
      >
        {!flat && view === null && (
          <div className="mobile-initial-board">{board}</div>
        )}
        {flat ? (
          board
        ) : ready ? (
          <SceneBoundary fallback={board} onError={() => setFlat(true)}>
            <Scene
              fen={fen}
              selected={selected}
              targets={targets}
              onSquare={choose}
              solved={celebrating}
              active={active}
              exploring={exploring}
              onReady={revealScene}
            />
          </SceneBoundary>
        ) : null}
        {!flat && !sceneReady && (
          <button
            className="scene-preview"
            disabled={ready}
            aria-busy={ready}
            onClick={activate}
            aria-label="Start puzzle"
          >
            <picture>
              <source
                media="(max-width: 1000px)"
                srcSet="/chess-preview-compact.webp"
              />
              <Image
                src="/chess-preview-desktop.webp"
                alt="Ivory and sage chessboard preview"
                width={1188}
                height={680}
                unoptimized
                loading="eager"
                fetchPriority="high"
              />
            </picture>
            <span>
              {ready ? "Preparing the board…" : "Start puzzle"}
              {!ready && <ArrowUpRight size={13} />}
            </span>
          </button>
        )}
        {celebrating && (
          <div className="celebration" aria-hidden="true">
            ✦
          </div>
        )}
      </div>
      <div className="board-instruction">
        <span>
          {exploring
            ? "Drag to explore the board"
            : "Select a white piece, then a highlighted square."}
        </span>
        {!flat && sceneReady && (
          <button
            aria-pressed={exploring}
            onClick={() => setExploring((v) => !v)}
          >
            {exploring ? "Back to puzzle" : "Explore 3D"}
          </button>
        )}
      </div>
      <div className={`puzzle-panel ${solved ? "is-solved" : ""}`}>
        <div className="puzzle-status">
          {solved ? <Check size={16} /> : <span className="status-dot" />}
          <p role="status" aria-live="polite">
            {message}
          </p>
        </div>
        {history.length > 0 && (
          <p className="move-history" aria-label="Moves played">
            {history.map((move, i) => (
              <span key={i}>
                {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ""}
                {move}
              </span>
            ))}
          </p>
        )}
        <div className="puzzle-controls">
          <button
            onClick={() => {
              if (!ready && !flat) activate();
              const hint = lines[0];
              setSelected(hint.from);
              setMessage(
                `Hint: move the ${names[game.get(hint.from)!.type]} from ${hint.from} to ${hint.to}.`,
              );
            }}
            disabled={attempted || !!pending || exploring}
          >
            <Lightbulb size={14} /> Hint
          </button>
          <button onClick={reset}>
            <RotateCcw size={14} />{" "}
            {attempted && !solved ? "Try again" : "Reset"}
          </button>
          <button className="new-puzzle" onClick={() => nextPuzzle()}>
            <Shuffle size={14} /> New puzzle
          </button>
        </div>
      </div>
    </div>
  );
}
