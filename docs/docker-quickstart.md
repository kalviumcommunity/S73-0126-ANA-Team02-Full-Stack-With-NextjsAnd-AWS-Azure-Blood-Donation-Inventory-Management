# Docker Quickstart

This guide shows how to build and run the Next.js App Router container locally.

## Prerequisites

- Docker Desktop installed and running.
- From the project root directory.

## Build the image

Builds the production image using the multi-stage Dockerfile.

```bash
# Build with a tag (you can change the tag name)
docker build -t blood-inventory:prod .
```

Optional: pass a public environment variable at build time (avoid baking secrets):

```bash
docker build --build-arg NEXT_PUBLIC_API_URL="https://api.example.com" -t blood-inventory:prod .
```

## Run the container

Runs the app and maps port 3000 inside the container to 3000 on your machine.

```bash
# Basic run
docker run --rm -p 3000:3000 blood-inventory:prod
```

If your app needs environment variables at runtime, pass them with `-e`:

```bash
# Public env var (safe for client) and private server-only var
# Replace with your real values
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="https://api.example.com" \
  -e DATABASE_URL="postgres://user:pass@host:5432/dbname" \
  blood-inventory:prod
```

## Access the app

Open http://localhost:3000 in your browser.

## Notes

- `-p 3000:3000` maps host port 3000 → container port 3000 (exposed in the Dockerfile).
- `--rm` cleans up the container when it stops.
- Public variables like `NEXT_PUBLIC_API_URL` may be present in the client bundle; private variables (e.g., `DATABASE_URL`) must never be hardcoded and should only be used on the server side.
