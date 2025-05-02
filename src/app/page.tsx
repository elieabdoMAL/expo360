"use client";

import OverlayContainer from "@/components/OverlayContainer";

export default function Page() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* 1) Embed the entire 3DVista tour via iframe */}
      <iframe
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

      <OverlayContainer />
    </div>
  );
}
