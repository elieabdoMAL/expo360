// /src/app/layout.tsx
"use client";

import { useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import AuthModal from "@/components/AuthModel";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Show the modal immediately on first render
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          {/* Render the page content beneath */}
          <main style={{ position: "relative" }}>{children}</main>

          {/* Show AuthModal exactly once on initial load */}
          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
