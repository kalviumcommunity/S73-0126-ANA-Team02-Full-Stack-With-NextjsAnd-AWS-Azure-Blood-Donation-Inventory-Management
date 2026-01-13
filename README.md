# Real-Time Blood Donation & Inventory Management Platform

> **Problem Statement :-**

India has milloins of willing blood donors , yet hospitals frequently face critical shortages. The issue isn't donation- it's _poor coordination, fragmented data, and outdated inventory systems_.

Blood availability data is often:

- Manually maintained
- Not updated in real time
- Disconnected between hospitals, NGOs and donors.

This leads to **avoidable delays and loss of life during emergencies**.
**BloodBridge** is a real-time, full-stack blood donation and inventory management platform that connects donors, hospitals, and NGOs on a single, secure system.

The platform ensures:
- Secure, verified access for all stakeholders
- Emergency alerts when blood is critically low

> **🎯 Core Features**

**👤 Donor Portal**
- Nearby hospital / NGO discovery using maps
- Emergency blood request notifications
- Donation history tracking

**🏥 Hospital & Blood Bank Dashboard**

- Real-time blood inventory updates
- Low-stock alerts (auto-triggered)
- Nearby donor discovery by blood group
- Blood request management
- Usage analytics & reporting

**🤝 NGO / Admin Panel**

- Verify hospitals & donors
- Monitor city / region-wise blood availability
- Coordinate emergency donation drives
- Access platform-wide analytics

- Next.js – UI & routing
- React – Building components
- Tailwind CSS – Styling
- Maps API – Location & nearby search

**Backend**

- WebSockets – Real-time updates

**Database**

- MongoDB / Azure Cosmos DB – Store users & blood inventory
**Authentication**

- JWT – Secure login
- Role-based access – Donor, Hospital, NGO

**Cloud & Deployment**

- AWS / Azure – Hosting & cloud services
- Cloud Storage – Documents & reports

## Deployment

This project is production-ready with CI/CD and containerization:


### Environment & Secrets


## Environment Audit — Confirmation

I reviewed the repository for environment variable usage and git ignores. Findings:

- No server-side secrets are accessed in client components. Server-only variables such as `DATABASE_URL` and `REDIS_URL` are only read from server components or server-only helpers (for example, `src/lib/env.ts` and `src/app/env-example/page.tsx`) and are not imported into client components.
- Only `NEXT_PUBLIC_` variables are used on the client. The example client component `src/app/env-example/ClientInfo.tsx` reads `process.env.NEXT_PUBLIC_API_BASE_URL` (safe to expose).
- `.env.local` and all other `.env*` files are ignored by Git via `.gitignore`, while `.env.example` is explicitly allowed and committed as a template.

Conclusion: environment variables are used according to Next.js conventions and server secrets are not exposed to client bundles.

## Environment Variables & Secrets Management

**Assignment-style Explanation**

**Purpose of `.env.local` and `.env.example`**

- `.env.local`: A developer's local file that holds real credentials and secrets (database URLs, API keys). This file is listed in `.gitignore` and must NOT be committed. Each developer keeps their own copy.
- `.env.example`: A committed template that contains placeholders and comments. Developers copy this file to `.env.local` and replace placeholders with real values. This allows safe onboarding without sharing secrets.

**Server-side vs Client-side variables**

- Server-side only: variables without the `NEXT_PUBLIC_` prefix (for example, `DATABASE_URL`, `REDIS_URL`, `STRIPE_SECRET_KEY`) are available only on the server. Use them in API routes, server components, or server helpers. Never import or expose them to client code.
- Client-safe: variables prefixed with `NEXT_PUBLIC_` (for example, `NEXT_PUBLIC_API_BASE_URL`) are embedded in the browser bundle and are visible to users. Only put non-sensitive values here.

**How `NEXT_PUBLIC_` works in Next.js**

- Next.js automatically exposes any environment variable that starts with `NEXT_PUBLIC_` to both server and client code. This makes it convenient for public configuration but unsafe for secrets. If a variable does not start with `NEXT_PUBLIC_`, it stays server-only.

**How to replicate the setup (step-by-step)**

1. Copy the template: `cp .env.example .env.local` (or create `.env.local` by hand on Windows).
2. Replace placeholder values in `.env.local` with real credentials (DB URL, Redis URL, etc.).
3. Start the dev server: `npm run dev` — restart the server after changing env files.
4. Ensure `.env.local` is not committed (it is ignored by `.gitignore`). Only `.env.example` is committed.

**Common mistakes and how to avoid them**

- Exposing secrets: Do not put secret keys in `NEXT_PUBLIC_` variables. If a secret appears in client code, rotate it and move it server-side.
- Missing `NEXT_PUBLIC_` prefix for client values: If a value must be accessed by the browser, prefix it with `NEXT_PUBLIC_` so Next.js includes it in the client bundle.
- Build-time vs runtime confusion: Some deployment platforms bake env values at build time. If you need runtime-configurable values, use runtime environment injection supported by your hosting (and ensure you rebuild if you rely on build-time injection for static pages).

This setup keeps secrets secure, enables safe client configuration, and helps developers reproduce local environments quickly.

> **How does choosing between static, dynamic, and hybrid rendering affect performance, scalability, and data freshness?**

- Static Rendering maximizes speed and scalability but sacrifices freshness.
- Dynamic Rendering guarantees fresh data but increases server cost and latency.
- Hybrid Rendering provides the best balance by serving static pages that regenerate periodically.

By mixing these strategies page-by-page, a Next.js app can:

- Load faster
- Scale efficiently
- Keep critical data fresh

This approach reflects real-world production decision-making, not just implementation knowledge.
