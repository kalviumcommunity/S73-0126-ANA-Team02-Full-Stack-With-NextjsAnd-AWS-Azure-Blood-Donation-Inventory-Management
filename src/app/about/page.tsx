// Static Site Generation: rendered at build time; no revalidation so content stays fixed until next deploy.
export default function AboutPage() {
  return (
    <main>
      <h1>About This Project</h1>
      <p>
        This page is statically generated during the build for fast loads and CDN caching. It suits
        content that rarely changes, like project descriptions and team info.
      </p>
    </main>
  );
}
