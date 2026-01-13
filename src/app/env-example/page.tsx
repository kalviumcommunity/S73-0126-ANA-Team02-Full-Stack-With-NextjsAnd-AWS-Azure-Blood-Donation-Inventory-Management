import React from "react";
import ClientInfo from "./ClientInfo";

// This is a server component (default in App Router). Server components
// run on the server and may access server-only environment variables such
// as DATABASE_URL or REDIS_URL via process.env. These must NEVER be sent to
// the client or used inside client components.
export default function EnvExamplePage() {
  // Access a server-only environment variable. We will NOT render its raw
  // value to avoid accidental exposure; instead we only indicate whether
  // it is configured.
  const databaseUrl = process.env.DATABASE_URL;
  const redisUrl = process.env.REDIS_URL;

  return (
    <main style={{ padding: 24 }}>
      <h2>Environment Variable Usage Example</h2>

      <section>
        <h3>Server-only variables (accessed on the server)</h3>
        <p>
          <strong>DATABASE_URL:</strong>{" "}
          {databaseUrl ? "(configured on server)" : "(not configured)"}
        </p>
        <p>
          <strong>REDIS_URL:</strong>{" "}
          {redisUrl ? "(configured on server)" : "(not configured)"}
        </p>
        <p style={{ fontStyle: "italic" }}>
          Important: server-only variables must not be used in client components
          because that would include the secret values in the browser bundle.
          Always keep secrets on the server and never interpolate them into
          client-side code or responses that are sent to the browser.
        </p>
      </section>

      <hr style={{ margin: "24px 0" }} />

      <section>
        <h3>Client-safe variables</h3>
        <ClientInfo />
      </section>
    </main>
  );
}
