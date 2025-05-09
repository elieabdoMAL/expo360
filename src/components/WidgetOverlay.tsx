// src/components/WidgetOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/contentfulClient";

interface WidgetFields {
  triggerId: string;
  widgetType: "iframe" | "html" | "video" | string;
  url?: string;
  widthPct?: number;
  heightPct?: number;
  htmlContent?: string;
}

export default function WidgetOverlay() {
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);
  const [widget, setWidget] = useState<WidgetFields | null>(null);

  // 1) listen for hotspot-trigger messages
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const { type, triggerId } = e.data || {};
      if (type === "hotspot-trigger" && typeof triggerId === "string") {
        setActiveTrigger(triggerId);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // 2) whenever activeTrigger changes, fetch that widget from Contentful
  useEffect(() => {
    if (!activeTrigger) {
      setWidget(null);
      return;
    }
    client
      .getEntries({
        content_type: "widget",
        "fields.triggerId": activeTrigger,
        limit: 1,
      })
      .then((res) => {
        if (res.items.length) {
          // cast to work around the generic constraint
          const entry = res.items[0] as unknown as {
            fields: WidgetFields;
          };
          setWidget(entry.fields);
        } else {
          setWidget(null);
        }
      })
      .catch((err) => {
        console.error("WidgetOverlay fetch error", err);
        setWidget(null);
      });
  }, [activeTrigger]);

  if (!widget) return null;

  const {
    widgetType,
    url,
    htmlContent,
    widthPct = 80,
    heightPct = 80,
  } = widget;

  return (
    <div
      onClick={() => setActiveTrigger(null)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: `${widthPct}vw`,
          height: `${heightPct}vh`,
        }}
      >
        {/* render by type */}
        {widgetType === "iframe" && url && (
          <iframe
            src={url}
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        )}
        {widgetType === "html" && htmlContent && (
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
              background: "white",
              padding: 20,
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
        {widgetType === "video" && url && (
          <video src={url} controls style={{ width: "100%", height: "100%" }} />
        )}
        {/* add more types as you like */}

        <button
          onClick={() => setActiveTrigger(null)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "white",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
