# Database Setup Guide

## Overview

This document explains the normalized database schema for the Blood Donation & Inventory Management system using PostgreSQL and Prisma.

## 📊 Database Schema Features

### ✅ Normalization (1NF, 2NF, 3NF)

- **1NF**: All tables have atomic values, no repeating groups
- **2NF**: No partial dependencies; all non-key attributes depend on the entire primary key
- **3NF**: No transitive dependencies; all attributes depend directly on the primary key

### ✅ Key Constraints

- **Primary Keys**: UUID-based unique identifiers for all entities
- **Foreign Keys**: Proper relationships with referential integrity
- **Unique Constraints**: Email, phone, registration numbers
- **NOT NULL**: Critical fields marked as required
- **ON DELETE CASCADE**: Automatic cleanup of related records

### ✅ Performance Optimization

- **Indexes**: Strategic indexes on frequently queried fields:
  - `bloodGroup`, `city`, `state`, `pincode`
  - `userId`, `hospitalId`, `bloodBankId`
  - `status`, `createdAt`, `donationDate`
  - Composite indexes for unique constraints

## 🗃️ Entity Relationships

### Core Entities

```
User (1) ──────── (N) Donation
  │
  ├──────────── (N) BloodRequest
  │
  └──────────── (1) BloodBank/Hospital (role-based)

BloodBank (1) ── (N) BloodInventory
  │
  ├──────────── (N) Donation
  │
  └──────────── (N) BloodRequest

Hospital (1) ─── (N) BloodRequest

Donation (N) ─── (1) User (donor)
  │
  └──────────── (1) BloodBank

BloodRequest (N) ─ (1) User (requester)
  │
  ├──────────── (1) Hospital
  │
  └──────────── (1) BloodBank
```

## 🚀 Setup Instructions

### 1. Prerequisites

Ensure you have:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git

### 2. Install Dependencies

```bash
npm install
```

This will install:

- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI (dev dependency)
- `bcryptjs` - Password hashing
- `zod` - Runtime type validation
- `ts-node` - For running TypeScript scripts

### 3. Configure Database

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blood_bank_db?schema=public"

# Example for local PostgreSQL:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blood_bank_db?schema=public"

# Example for cloud PostgreSQL (e.g., Supabase, Railway):
# DATABASE_URL="postgresql://user:pass@db.example.com:5432/dbname"
```

### 4. Create Database

#### Option A: Using PostgreSQL CLI

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE blood_bank_db;

# Exit
\q
```

#### Option B: Using GUI (pgAdmin, DBeaver, etc.)

- Create a new database named `blood_bank_db`

### 5. Run Migrations

Generate Prisma Client and create database tables:

```bash
# Generate Prisma Client (creates TypeScript types)
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# OR create a migration (for production)
npm run prisma:migrate
```

### 6. Seed Database (Optional)

Populate database with sample data:

```bash
npm run prisma:seed
```

This creates:

- 1 Admin user
- 2 Blood banks with inventory
- 1 Hospital
- 2 Donor users
- Sample donations
- Sample campaign

**Default credentials:**

- Admin: `admin@bloodbank.com` / `admin123`
- Donor: `john.doe@example.com` / `donor123`

### 7. View Database (Optional)

Open Prisma Studio to view/edit data:

```bash
npm run prisma:studio
```

Access at: http://localhost:5555

## 📝 Available Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Push schema to DB (development only)
npm run prisma:push

# View/edit database
npm run prisma:studio

# Seed database
npm run prisma:seed

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## 🔐 Security Best Practices

### 1. Password Hashing

Always hash passwords using bcrypt:

```typescript
import bcrypt from "bcryptjs";
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. Input Validation

Use Zod for runtime validation:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', ...]),
});
```

### 3. Environment Variables

Never commit `.env` files. Use environment variables for:

- `DATABASE_URL`
- API keys
- Secret tokens

## 📊 Schema Details

### User Entity

- **Purpose**: Stores all users (donors, staff, admins)
- **Key Fields**: email, role, bloodGroup, city
- **Relationships**: donations, bloodRequests, bloodBank, hospital
- **Indexes**: email, phone, bloodGroup, city, role

### BloodBank Entity

- **Purpose**: Blood bank locations and details
- **Key Fields**: registrationNo, city, state, coordinates
- **Relationships**: inventory, donations, bloodRequests
- **Indexes**: city, state, pincode, isActive

### BloodInventory Entity

- **Purpose**: Current blood stock at each blood bank
- **Key Fields**: bloodGroup, quantity, expiryDate
- **Constraints**: One record per blood group per blood bank
- **Indexes**: bloodGroup, bloodBankId, quantity

### BloodRequest Entity

- **Purpose**: Tracks blood requests lifecycle
- **Key Fields**: bloodGroup, quantityNeeded, status, urgency
- **Relationships**: requester, hospital, bloodBank
- **Indexes**: bloodGroup, status, urgency, requiredBy

### Donation Entity

- **Purpose**: Records blood donation events
- **Key Fields**: bloodGroup, donationDate, status, unitSerialNumber
- **Relationships**: donor, bloodBank
- **Indexes**: donorId, bloodGroup, status, donationDate

## 🔍 Common Queries

### Get Blood Availability by City

```typescript
const inventory = await prisma.bloodInventory.findMany({
  where: {
    bloodBank: {
      city: "Mumbai",
      isActive: true,
    },
    quantity: { gt: 0 },
  },
  include: {
    bloodBank: {
      select: {
        name: true,
        address: true,
        phone: true,
      },
    },
  },
});
```

### Find Compatible Donors

```typescript
const donors = await prisma.user.findMany({
  where: {
    role: "DONOR",
    bloodGroup: "O_POSITIVE",
    city: "Mumbai",
    isActive: true,
    isVerified: true,
  },
});
```

### Get User's Donation History

```typescript
const donations = await prisma.donation.findMany({
  where: { donorId: userId },
  include: {
    bloodBank: {
      select: { name: true, city: true },
    },
  },
  orderBy: { donationDate: "desc" },
});
```

## 🔄 Migration Workflow

### Development

1. Modify `schema.prisma`
2. Run `npm run prisma:push` (quick, no migration files)
3. Test changes

### Production

1. Modify `schema.prisma`
2. Run `npm run prisma:migrate` (creates migration files)
3. Commit migration files
4. Deploy and run migrations on production

## 🐛 Troubleshooting

### Connection Issues

```bash
# Test database connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Reset Database

```bash
# ⚠️ WARNING: Deletes all data!
npx prisma migrate reset
```

### Schema Sync Issues

```bash
# Pull current DB schema
npx prisma db pull

# Generate client
npm run prisma:generate
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Normalization Guide](https://en.wikipedia.org/wiki/Database_normalization)

## 🎯 Next Steps

1. ✅ Database schema created
2. ✅ Prisma client configured
3. 🔲 Create API routes for CRUD operations
4. 🔲 Implement authentication
5. 🔲 Build frontend forms
6. 🔲 Add data validation
7. 🔲 Implement search and filters
8. 🔲 Add real-time notifications
