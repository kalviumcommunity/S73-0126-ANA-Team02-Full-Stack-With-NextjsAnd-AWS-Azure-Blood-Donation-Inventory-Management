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

- CI workflow builds on push to main: see [\.github/workflows/ci.yml](.github/workflows/ci.yml). It installs dependencies, lints, and performs a production build using GitHub Secrets (no hardcoded secrets).
- Docker image build workflow: see [\.github/workflows/docker-build.yml](.github/workflows/docker-build.yml). It builds a Docker image from the repository Dockerfile.
- Local container run: see [docs/docker-quickstart.md](docs/docker-quickstart.md) for step-by-step `docker build` and `docker run` instructions.

### Environment & Secrets

- Only the template [\.env.example](.env.example) is committed. Real env files are ignored via [\.gitignore](.gitignore).
- Public variables (e.g., `NEXT_PUBLIC_API_URL`) can be exposed to the client; private variables (e.g., `DATABASE_URL`) must only be read server-side. See usage helpers in [src/lib/env.ts](src/lib/env.ts).
- In CI and Docker, provide secrets via environment injection (GitHub Secrets / `docker run -e`)—never hardcode secrets in source.

> **How does choosing between static, dynamic, and hybrid rendering affect performance, scalability, and data freshness?**

- Static Rendering maximizes speed and scalability but sacrifices freshness.
- Dynamic Rendering guarantees fresh data but increases server cost and latency.
- Hybrid Rendering provides the best balance by serving static pages that regenerate periodically.

By mixing these strategies page-by-page, a Next.js app can:

- Load faster
- Scale efficiently
- Keep critical data fresh

This approach reflects real-world production decision-making, not just implementation knowledge.
