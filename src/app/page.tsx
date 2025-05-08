"use client";

import { useRef } from "react";
import OverlayContainer from "@/components/OverlayContainer";

export default function Page() {
  // <-- keep the ref nullable
  const tourRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <iframe
        ref={tourRef}
        src="/3dvista/index.html"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          zIndex: 0,
        }}
        allow="vr; gyroscope; accelerometer"
      />

      {/* pass the same ref down */}
      <OverlayContainer iframeRef={tourRef} />
    </div>
  );
}
