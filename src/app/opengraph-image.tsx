import { ImageResponse } from "next/og";
export const alt = "Salah-Eddine Lachkar — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f7f5ef",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "72px 85px",
        color: "#292f29",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 20,
          letterSpacing: 5,
          color: "#9a4e33",
        }}
      >
        DEVELOPER. TEAMMATE. CURIOUS HUMAN.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 85,
          marginTop: 58,
          letterSpacing: -4,
        }}
      >
        Salah-Eddine Lachkar.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 44,
          marginTop: 20,
          color: "#6a785b",
        }}
      >
        Thoughtful code. Playful possibilities.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          marginTop: 80,
          justifyContent: "space-between",
        }}
      >
        <span>Full-Stack Developer / Casablanca</span>
        <span>lachkar.me ↗</span>
      </div>
    </div>,
    size,
  );
}
