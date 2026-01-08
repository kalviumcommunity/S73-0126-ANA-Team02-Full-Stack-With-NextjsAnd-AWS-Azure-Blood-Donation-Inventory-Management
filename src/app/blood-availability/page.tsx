// Incremental Static Regeneration: static by default but revalidated every 60s for near-real-time availability.
export const revalidate = 60; // Next.js will regenerate this page in the background at most once per minute.

async function getAvailabilitySnapshot() {
  // In production, fetch inventory with `next: { revalidate: 60 }` to align with ISR.
  return [
    { bloodType: "A+", units: 24 },
    { bloodType: "B+", units: 18 },
    { bloodType: "O-", units: 12 },
    { bloodType: "AB+", units: 7 }
  ];
}

export default async function BloodAvailabilityPage() {
  const availability = await getAvailabilitySnapshot();

  return (
    <main>
      <h1>Blood Availability</h1>
      <p>
        This page uses ISR: users get fast static responses while the data refreshes in the background
        every 60 seconds.
      </p>
      <ul>
        {availability.map(({ bloodType, units }) => (
          <li key={bloodType}>
            {bloodType}: {units} units
          </li>
        ))}
      </ul>
    </main>
  );
}
