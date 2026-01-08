/**
 * Environment access helpers.
 * - Public vars: prefixed with NEXT_PUBLIC_, safe to expose to client bundles.
 * - Private vars: never prefixed; read only on the server (API routes, server actions, etc.).
 */
export const publicEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api"
};

export function getDatabaseUrl() {
  // Only call this in server-only contexts; it must never leak to the browser bundle.
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing; set it in the server environment.");
  }
  return url;
}
