"use client";
import React, { useEffect, useState } from "react";

// Client-side component: safe to read NEXT_PUBLIC_ environment variables
// Variables prefixed with NEXT_PUBLIC_ are exposed to the browser by Next.js
// and can be referenced from client code. Do NOT put secrets here.
export default function ClientInfo() {
  const [apiBase, setApiBase] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This reads a client-safe env var that is bundled into the client.
    setApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);
  }, []);

  return (
    <div>
      <h3>Client-safe environment variable</h3>
      <p>
        <strong>NEXT_PUBLIC_API_BASE_URL:</strong> {apiBase ?? "(not defined)"}
      </p>
      <p style={{ fontStyle: "italic" }}>
        Note: only variables starting with <code>NEXT_PUBLIC_</code> are
        available in client-side code. Do not store secrets in these variables.
      </p>
    </div>
  );
}
