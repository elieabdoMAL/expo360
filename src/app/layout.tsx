"use client";

import "@/app/globals.css";
import ChatWidget from "@/components/ChatWidget";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
          {/* This is where your main content will be rendered */}
          {/* intercom based in contentful */}
          <ChatWidget />
        </body>
      </html>
    </ClerkProvider>
  );
}
