"use client";

import "@/app/globals.css";
import ChatWidget from "@/components/ChatWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* This drives Intercom 100% via Contentful */}
        <ChatWidget />
      </body>
    </html>
  );
}
