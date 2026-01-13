import { publicEnv } from "../lib/env";

export default function HomePage() {
  /* Server Component reads a public env var; NEXT_PUBLIC_ values are safe to send to clients. */
  const apiUrl = publicEnv.apiUrl;

  return (
    <main>
      <h1>Welcome to Blood Donation Inventory</h1>
      <p>Next.js App Router + TypeScript + React Server Components.</p>
      <p>
        Current API endpoint (public): <strong>{apiUrl}</strong>
      </p>
      <p>
        Private secrets like DATABASE_URL stay on the server; access them via
        server-only code (e.g., API routes or server actions) so they never
        reach the browser bundle.
      </p>
    </main>
  );
}
