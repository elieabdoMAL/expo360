// src/components/MiniMap.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/lib/contentfulClient";

// Minimal interface for the fields we actually use
interface MapConfigFields {
  smallMapImage: { fields: { file: { url: string } } };
  fullMapImage: { fields: { file: { url: string } } };
}

export default function MiniMap() {
  const [config, setConfig] = useState<MapConfigFields | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    client
      .getEntries({ content_type: "mapConfig", limit: 1, include: 1 })
      .then((res) => {
        if (!res.items.length) return;
        // Cast via unknown to overcome TS's generic constraint check:
        const entry = res.items[0] as unknown as { fields: MapConfigFields };
        setConfig(entry.fields);
      })
      .catch((err) => {
        console.error("MiniMap: fetch error", err);
      });
  }, []);

  if (!config) return null;

  // Normalize URLs
  let smallUrl = config.smallMapImage.fields.file.url;
  let fullUrl = config.fullMapImage.fields.file.url;
  if (!smallUrl.startsWith("http")) smallUrl = `https:${smallUrl}`;
  if (!fullUrl.startsWith("http")) fullUrl = `https:${fullUrl}`;

  return (
    <>
      {/* Thumbnail */}
      <Image
        src={smallUrl}
        alt="Mini Map"
        width={100}
        height={100}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          cursor: "pointer",
          zIndex: 20,
          border: "2px solid rgba(255,255,255,0.8)",
          borderRadius: 4,
          pointerEvents: "auto",
        }}
        onClick={() => setExpanded(true)}
      />

      {/* Expanded overlay */}
      {expanded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 30,
            pointerEvents: "auto",
          }}
        >
          <div style={{ position: "relative", width: "80vw", height: "80vh" }}>
            <Image
              src={fullUrl}
              alt="Full Map"
              fill
              style={{ objectFit: "cover", borderRadius: 4 }}
            />

            <button
              onClick={() => setExpanded(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: "6px 12px",
                background: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
