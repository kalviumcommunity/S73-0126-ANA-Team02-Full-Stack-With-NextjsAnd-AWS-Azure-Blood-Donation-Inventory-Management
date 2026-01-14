import { publicEnv } from "../lib/env";
import Welcome from "../components/Welcome";
import ApiInfo from "../components/ApiInfo";

export default function HomePage() {
  /* Server Component reads a public env var; NEXT_PUBLIC_ values are safe to send to clients. */
  const apiUrl = publicEnv.apiUrl;

  return (
    <main>
      <Welcome />
      <ApiInfo apiUrl={apiUrl} />
    </main>
  );
}
