"use client";

import { RefObject } from "react";
import MiniMap from "./MiniMap";

interface Props {
  iframeRef: RefObject<HTMLIFrameElement | null>;
}

export default function OverlayContainer({ iframeRef }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <MiniMap tourRef={iframeRef} />
      {/* future HUD widgets go here */}
    </div>
  );
}
