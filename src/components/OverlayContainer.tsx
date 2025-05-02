"use client";

import MiniMap from "./MiniMap";

export default function OverlayContainer() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <MiniMap />
      {/* future HUD widgets go here */}
    </div>
  );
}
