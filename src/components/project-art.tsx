export function ProjectArt({ kind }: { kind: string }) {
  if (kind === "market")
    return (
      <div className="project-art market-art" aria-hidden="true">
        <div className="mini-terminal">
          <div className="terminal-top">
            <b>
              MRPNL<span> / MARKET OVERVIEW</span>
            </b>
            <i>● LIVE</i>
          </div>
          <div className="chart-value">
            A clearer market.<span>CONTEXT BEFORE THE NEXT MOVE</span>
          </div>
          <svg viewBox="0 0 500 120" fill="none">
            <path
              d="M0 96L18 89L34 94L50 66L65 76L83 60L101 69L116 34L132 46L150 39L168 68L183 59L202 72L220 46L238 57L257 40L276 51L295 19L311 32L330 25L347 47L365 29L384 38L402 19L420 28L440 12L463 23L485 5L500 9"
              stroke="#b8c789"
              strokeWidth="2.5"
            />
            <path d="M0 115H500M0 75H500M0 35H500" stroke="#ffffff12" />
          </svg>
          <div className="market-bottom">
            <span>LEARN</span>
            <span>OBSERVE</span>
            <span>UNDERSTAND ↗</span>
          </div>
        </div>
      </div>
    );
  if (kind === "agency")
    return (
      <div className="project-art agency-art" aria-hidden="true">
        <div className="agency-orbit" />
        <span className="art-topline">
          INDEPENDENT THINKING. DIGITAL CRAFT.
        </span>
        <span className="agency-title">
          Ideas deserve
          <br />
          <em>an escape.</em>
        </span>
        <span className="agency-footer">
          idescape <span>↗</span>
        </span>
      </div>
    );
  if (kind === "staking")
    return (
      <div className="project-art staking-art" aria-hidden="true">
        <div className="staking-rings">
          <i />
          <i />
          <i />
        </div>
        <span className="staking-symbol">b.</span>
        <span className="art-bottomline">CONNECTED BY DESIGN.</span>
      </div>
    );
  if (kind === "mosaic")
    return (
      <div className="project-art mosaic-art" aria-hidden="true">
        <div className="mosaic-panel">
          <span>MOSAIC / YOUR DAILY PICTURE</span>
          <div className="mosaic-tiles">
            <div>
              <small>FINANCE</small>
              <b>In balance.</b>
              <i className="tile-chart" />
            </div>
            <div>
              <small>HEALTH</small>
              <i className="tile-ring" />
              <b>Day by day.</b>
            </div>
            <div>
              <small>LOCAL RECORDS</small>
              <b>
                One place.
                <br />
                Your pace.
              </b>
            </div>
          </div>
          <small>FINANCE · HEALTH · LOCAL STORAGE</small>
        </div>
      </div>
    );
  if (kind === "operations")
    return (
      <div className="project-art operations-art" aria-hidden="true">
        <div className="ops-panel">
          <span>OPERATIONS / CONTROL ROOM</span>
          <h4>
            Clarity behind
            <br />
            every account.
          </h4>
          {["Accounts", "Integrations", "Market context"].map((label, i) => (
            <div className="ops-row" key={label}>
              <b>0{i + 1}</b>
              <span>{label}</span>
              <i>↗</i>
            </div>
          ))}
        </div>
      </div>
    );
  if (kind === "samurai")
    return (
      <div className="project-art samurai-art" aria-hidden="true">
        <span className="art-topline">INTERFACES MEET ONCHAIN SYSTEMS</span>
        <svg viewBox="0 0 400 220">
          <path
            d="m200 20 155 85-155 95L45 105Z M200 20v180 M45 105h310 M120 62l160 95 M280 62 120 157"
            fill="none"
            stroke="#adbaa0"
            strokeWidth="1"
          />
          {[
            [200, 20],
            [355, 105],
            [200, 200],
            [45, 105],
            [200, 105],
          ].map(([x, y]) => (
            <circle key={x + ":" + y} cx={x} cy={y} r="9" fill="#d4b086" />
          ))}
        </svg>
        <span className="art-bottomline">
          DASHBOARDS · WALLETS · SMART CONTRACTS
        </span>
      </div>
    );
  if (kind === "workflows" || kind === "automation")
    return (
      <div className="project-art workflow-art" aria-hidden="true">
        <span className="art-topline">
          {kind === "workflows"
            ? "REUSABLE SKILLS / EVERYDAY POSSIBILITIES"
            : "LESS REPETITION / MORE INTENTION"}
        </span>
        <div className="workflow-nodes">
          {(kind === "workflows"
            ? ["Brief", "Create", "Validate", "Review"]
            : ["Trigger", "Process", "Check", "Result"]
          ).map((label, i) => (
            <div key={label}>
              <small>0{i + 1}</small>
              <b>{label}</b>
              <span>{i === 3 ? "✓" : "↗"}</span>
            </div>
          ))}
        </div>
        <span className="art-bottomline">
          {kind === "workflows"
            ? "ARTICLES · IMAGES · DAILY TASKS"
            : "BROWSER WORKFLOWS · REUSABLE TOOLS"}
        </span>
      </div>
    );
  if (kind === "research")
    return (
      <div className="project-art research-art" aria-hidden="true">
        <span className="art-topline">SAFAR / LANGUAGE & INTERFACE</span>
        <div>
          <b lang="ar" dir="rtl">
            لغة
          </b>
          <span>language</span>
        </div>
        <span className="art-bottomline">
          ENGLISH ↔ ARABIC / RESPONSIVE BY DESIGN
        </span>
      </div>
    );
  if (kind === "strategies")
    return (
      <div className="project-art strategy-art" aria-hidden="true">
        <span className="art-topline">OBSERVE / TEST / REFINE</span>
        <svg viewBox="0 0 400 180">
          {Array.from({ length: 18 }, (_, i) => {
            const y = 95 + Math.sin(i * 0.8) * 30 - i * 2;
            return (
              <g
                key={i}
                stroke={i % 3 ? "#879d7c" : "#c99573"}
                fill={i % 3 ? "#879d7c" : "#c99573"}
              >
                <path d={`M${25 + i * 20} ${y - 20}v60`} />
                <rect
                  x={20 + i * 20}
                  y={y}
                  width="10"
                  height={15 + (i % 3) * 5}
                />
              </g>
            );
          })}
        </svg>
        <span className="art-bottomline">
          BOOKMAP · NINJATRADER · TRADINGVIEW
        </span>
      </div>
    );
  return (
    <div className="project-art creative-art" aria-hidden="true">
      <span className="art-topline">CODE AS A MATERIAL</span>
      <svg viewBox="0 0 400 230">
        {Array.from({ length: 15 }, (_, i) => (
          <ellipse
            key={i}
            cx="200"
            cy="115"
            rx={35 + i * 8}
            ry="80"
            transform={`rotate(${i * 12} 200 115)`}
            fill="none"
            stroke={i % 2 ? "#617b63" : "#b8835b"}
            strokeWidth=".8"
          />
        ))}
      </svg>
      <span className="art-bottomline">INTERACTION · MOTION · EXPLORATION</span>
    </div>
  );
}
