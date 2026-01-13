// Server-Side Rendering: rendered on every request to ensure always-fresh dashboard data.
export const dynamic = "force-dynamic"; // In App Router, this opts into SSR for this route.

async function getLiveMetrics() {
  // Simulate a per-request fetch; in real use, call your API/DB with cache: "no-store".
  return {
    fetchedAt: new Date().toUTCString(),
    pendingDonations: Math.floor(Math.random() * 10) + 5,
    availableUnits: Math.floor(Math.random() * 50) + 50,
  };
}

export default async function DashboardPage() {
  const metrics = await getLiveMetrics();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>
        This dashboard is server-rendered on each request for real-time
        accuracy.
      </p>
      <ul>
        <li>Fetched at: {metrics.fetchedAt}</li>
        <li>Pending donations: {metrics.pendingDonations}</li>
        <li>Available units: {metrics.availableUnits}</li>
      </ul>
    </main>
  );
}
