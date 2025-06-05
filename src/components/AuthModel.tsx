// /src/components/AuthModal.tsx
"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  // mode === "signIn" or "signUp"
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  return (
    <div
      // full-screen semi-opaque backdrop
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // clicking outside closes
    >
      <div
        // white box containing either SignIn or SignUp
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 8,
          maxWidth: 400,
          width: "90%",
          padding: "24px 16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {/* Close “X” button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {mode === "signIn" ? (
          <>
            <h2 style={{ textAlign: "center", marginBottom: 16 }}>Sign In</h2>
            <SignIn
              // no routing prop; default behavior
              appearance={{
                elements: {
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                },
              }}
            />
            <p style={{ textAlign: "center", marginTop: 12 }}>
              Don’t have an account?{" "}
              <span
                style={{ color: "#3B82F6", cursor: "pointer" }}
                onClick={() => setMode("signUp")}
              >
                Sign up
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 style={{ textAlign: "center", marginBottom: 16 }}>Sign Up</h2>
            <SignUp
              // no routing prop; default behavior
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-green-600 hover:bg-green-700 text-white",
                },
              }}
            />
            <p style={{ textAlign: "center", marginTop: 12 }}>
              Already have an account?{" "}
              <span
                style={{ color: "#3B82F6", cursor: "pointer" }}
                onClick={() => setMode("signIn")}
              >
                Sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
