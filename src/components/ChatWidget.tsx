// src/components/ChatWidget.tsx
"use client";

import { useEffect } from "react";
import { client } from "@/lib/contentfulClient";

// 1) Define exactly the shape of the fields we expect
type ConfigFields = {
  widgetSrc: string;
  enabled?: boolean;
};

// 2) Minimal “entry” interface for our use
interface ConfigEntry {
  fields: ConfigFields;
}

// 3) Tell TS about the Tawk globals (so we don’t use `any`)
declare global {
  interface Window {
    Tawk_API: Record<string, unknown>;
    Tawk_LoadStart: Date;
  }
}

export default function ChatWidget() {
  useEffect(() => {
    let scriptEl: HTMLScriptElement;

    client
      .getEntries({
        content_type: "chatWidgetConfig",
        limit: 1,
      })
      .then((res) => {
        if (res.items.length === 0) return;

        // 4) Cast through unknown to our minimal entry type
        const entry = res.items[0] as unknown as ConfigEntry;
        const { widgetSrc, enabled = true } = entry.fields;

        if (!enabled || widgetSrc.trim() === "") return;

        // 5) Setup the Tawk globals
        // Use empty object if it hasn't been set yet
        if (!window.Tawk_API) {
          window.Tawk_API = {};
        }
        window.Tawk_LoadStart = new Date();

        // 6) Inject the Tawk.to script exactly as in their snippet
        scriptEl = document.createElement("script");
        scriptEl.async = true;
        scriptEl.src = `https://embed.tawk.to/${widgetSrc}`;
        scriptEl.charset = "UTF-8";
        scriptEl.setAttribute("crossorigin", "*");

        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode?.insertBefore(scriptEl, firstScript);
      })
      .catch((err: unknown) => {
        console.error("ChatWidget fetch error:", err);
      });

    return () => {
      // Cleanup
      if (scriptEl && document.head.contains(scriptEl)) {
        document.head.removeChild(scriptEl);
      }
    };
  }, []);

  return null;
}
