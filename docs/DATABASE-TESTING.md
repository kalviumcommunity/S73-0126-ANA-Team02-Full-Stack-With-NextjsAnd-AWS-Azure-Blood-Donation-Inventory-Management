# 🧪 Database Connection Testing Guide

## Overview

This guide explains how to verify that Prisma ORM is properly connected to your PostgreSQL database.

## Test Script Location

📁 `scripts/test-db-connection.ts`

## Running the Test

### Option 1: Using npm script (Recommended)

```bash
npm run test:db
```

### Option 2: Direct execution

```bash
npx tsx scripts/test-db-connection.ts
```

## What the Test Does

The test script performs 7 comprehensive checks:

### ✅ Test 1: Database Connection

Verifies that Prisma can connect to PostgreSQL using the `DATABASE_URL` from your `.env` file.

### ✅ Test 2: Count Users

Counts total users in the database to verify read access.

### ✅ Test 3: Fetch All Users

Retrieves user records with selected fields (id, email, name, role, bloodGroup) to test:

- SELECT queries
- Field selection
- Data retrieval

### ✅ Test 4: Count Blood Banks

Counts blood banks to verify multiple table access.

### ✅ Test 5: Fetch Blood Inventory

Retrieves inventory records with related blood bank data to test:

- JOIN operations
- Nested include queries
- Relational data fetching

### ✅ Test 6: Complex Query with Relations

Fetches donations with donor and blood bank details to test:

- Multiple relation includes
- Complex nested queries
- Type-safe relational queries

### ✅ Test 7: Aggregate Queries

Calculates blood inventory statistics (total, average) grouped by blood group to test:

- GROUP BY operations
- Aggregate functions (SUM, AVG)
- Advanced query capabilities

## Expected Output

```
🔍 Testing Database Connection...

✅ Test 1: Connecting to database...
   ✓ Database connection successful!

✅ Test 2: Counting users in database...
   ✓ Found 3 users in database

✅ Test 3: Fetching all users...
   ✓ Retrieved 3 users:
   1. John Doe (john.doe@example.com)
      Role: DONOR, Blood Group: O_POSITIVE
   2. System Administrator (admin@bloodbank.com)
      Role: ADMIN, Blood Group: N/A
   3. Jane Smith (jane.smith@example.com)
      Role: DONOR, Blood Group: A_POSITIVE

✅ Test 4: Counting blood banks...
   ✓ Found 2 blood banks

✅ Test 5: Fetching blood inventory...
   ✓ Retrieved 16 inventory records:
   1. A_POSITIVE - 45 units
      Location: Central Blood Bank, Mumbai
   [... more records ...]

✅ Test 6: Testing complex query with relations...
   ✓ Retrieved 1 donations with details:
   1. John Doe
      Blood Group: O_POSITIVE, Status: COMPLETED
      Blood Bank: Central Blood Bank, Mumbai

✅ Test 7: Testing aggregate queries...
   ✓ Blood inventory statistics by blood group:
      A_POSITIVE: Total = 117 units, Avg = 58.5 units
      B_POSITIVE: Total = 78 units, Avg = 39.0 units
      [... more statistics ...]

═══════════════════════════════════════════════════════════
✅ ALL TESTS PASSED!
═══════════════════════════════════════════════════════════
Database connection is working correctly.
Prisma Client is properly configured.
All CRUD operations are functional.
═══════════════════════════════════════════════════════════

🔌 Disconnected from database.
```

## Troubleshooting

### ❌ Error: "Can't reach database server"

**Possible Causes:**

1. PostgreSQL is not running
2. Incorrect DATABASE_URL in `.env`
3. Database doesn't exist
4. Wrong credentials

**Solutions:**

```bash
# Check PostgreSQL is running (Windows)
net start postgresql-x64-16

# Verify .env file
cat .env | grep DATABASE_URL

# Create database if missing
psql -U postgres -c "CREATE DATABASE blood_bank_db;"

# Test connection manually
psql -U postgres -d blood_bank_db -c "SELECT 1;"
```

### ❌ Error: "Prisma Client not found"

**Solution:**

```bash
npm run prisma:generate
npm install
```

### ❌ Error: "Table doesn't exist"

**Solution:**

```bash
npm run prisma:push
npm run prisma:seed
```

### ❌ Error: "Zero users found"

This means your database is empty. Run:

```bash
npm run prisma:seed
```

## When to Run This Test

✅ **After initial setup** - Verify everything is configured correctly  
✅ **After changing .env** - Confirm new DATABASE_URL works  
✅ **After schema changes** - Ensure migrations applied successfully  
✅ **Before deployment** - Pre-deployment health check  
✅ **When debugging** - Isolate database connection issues

## Using in Development

### Quick Health Check

Add to your development workflow:

```bash
# Morning routine
git pull
npm install
npm run test:db
npm run dev
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run test:db
```

### CI/CD Pipeline

Add to GitHub Actions:

```yaml
- name: Test Database Connection
  run: npm run test:db
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Integration with Your Application

Use the same patterns from the test script in your actual code:

### Simple Query

```typescript
import { prisma } from "@/lib/prisma";

const users = await prisma.user.findMany({
  where: { role: "DONOR" },
});
```

### Query with Relations

```typescript
const donations = await prisma.donation.findMany({
  include: {
    donor: true,
    bloodBank: true,
  },
});
```

### Aggregate Query

```typescript
const stats = await prisma.bloodInventory.groupBy({
  by: ["bloodGroup"],
  _sum: { quantity: true },
});
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Local Setup Guide](../docs/LOCAL-SETUP-GUIDE.md)
- [Database Schema Reference](../docs/database-schema-reference.md)
- [Quick Commands](../docs/QUICK-COMMANDS.md)

## Success Criteria

Your Prisma setup is working correctly if:

- ✅ All 7 tests pass
- ✅ No error messages appear
- ✅ Sample data is retrieved
- ✅ Relations work correctly
- ✅ Aggregate queries return results

---

**Last Updated:** January 14, 2026  
**Status:** ✅ All tests passing
