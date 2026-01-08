# Build script modes

- **build:dev** — Uses `NODE_ENV=development` with a local `NEXT_PUBLIC_API_URL`; helpful when you want production-style bundling but still point at local services.
- **build:staging** — Uses `NODE_ENV=production` while targeting staging APIs. Outputs an optimized build but keeps staging endpoints baked into the bundle.
- **build:prod** — Uses `NODE_ENV=production` with the production API endpoint. This is the artifact you deploy to production.

`cross-env` is used so these environment assignments work on Windows, macOS, and Linux shells.
