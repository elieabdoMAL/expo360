"use client";

import { RefObject, useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/lib/contentfulClient";

type Hotspot = {
  panoramaId: string;
  x: number; // percent
  y: number; // percent
  label: string;
};

interface MapConfigFields {
  smallMapImage: {
    fields: { file: { url: string } };
  };
  fullMapImage: {
    fields: {
      file: {
        url: string;
        details: { image: { width: number; height: number } };
      };
    };
  };
  hotspots: Hotspot[];
}

interface Props {
  tourRef: RefObject<HTMLIFrameElement | null>;
}

export default function MiniMap({ tourRef }: Props) {
  const [cfg, setCfg] = useState<MapConfigFields | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    client
      .getEntries({ content_type: "mapConfig", limit: 1, include: 1 })
      .then((res) => {
        if (!res.items.length) return;
        // cast to overcome Contentful’s generic constraint
        const entry = res.items[0] as unknown as { fields: MapConfigFields };
        setCfg(entry.fields);
      })
      .catch((err) => console.error("MiniMap: fetch error", err));
  }, []);

  if (!cfg) return null;

  let smallUrl = cfg.smallMapImage.fields.file.url;
  let fullUrl = cfg.fullMapImage.fields.file.url;
  if (!smallUrl.startsWith("http")) smallUrl = `https:${smallUrl}`;
  if (!fullUrl.startsWith("http")) fullUrl = `https:${fullUrl}`;

  const goTo = (panoramaId: string) => {
    console.log("[MiniMap] click →", panoramaId);
    const win = tourRef.current?.contentWindow;
    if (!win) {
      console.warn("[MiniMap] no iframe contentWindow!");
      return;
    }
    const msg = { type: "goto-panorama", panoramaId };
    console.log("[MiniMap] will postMessage →", msg, "to iframe window:", win);
    win.postMessage(msg, window.location.origin);
    console.log("[MiniMap] posted goto-panorama to iframe");
  };

  return (
    <>
      {/* thumbnail */}
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 20,
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      >
        <Image
          src={smallUrl}
          alt="Mini Map"
          width={100}
          height={100}
          style={{
            border: "2px solid rgba(255,255,255,0.8)",
            borderRadius: 4,
          }}
        />
      </div>

      {/* expanded */}
      {open && (
        <div
          onClick={() => setOpen(false)}
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
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "90vw",
              height: "90vh",
            }}
          >
            <Image
              src={fullUrl}
              alt="Full Map"
              fill
              style={{ objectFit: "contain", borderRadius: 4 }}
            />

            {/* hotspots */}
            {cfg.hotspots.map((hs) => (
              <button
                key={hs.panoramaId}
                onClick={() => goTo(hs.panoramaId)}
                title={hs.label}
                style={{
                  position: "absolute",
                  top: `${hs.y}%`,
                  left: `${hs.x}%`,
                  transform: "translate(-50%, -50%)",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 14,
                  height: 14,
                  cursor: "pointer",
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                •
              </button>
            ))}

            <button
              onClick={() => setOpen(false)}
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
