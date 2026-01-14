# 🚀 Local Database Setup Guide

## Complete step-by-step instructions to set up BloodLink with PostgreSQL

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v18 or higher) - Check: `node --version`
- [ ] **PostgreSQL** (v14 or higher) - Check: `psql --version`
- [ ] **npm** or **yarn** - Check: `npm --version`
- [ ] **Git** (optional, for version control)

---

## Step 1: Install PostgreSQL (If Not Installed)

### Windows

```powershell
# Option 1: Using Chocolatey
choco install postgresql

# Option 2: Download installer from
# https://www.postgresql.org/download/windows/
```

### Mac

```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create PostgreSQL Database

### Windows (PowerShell)

```powershell
# Connect to PostgreSQL (default user is 'postgres')
psql -U postgres

# In psql prompt, run:
CREATE DATABASE blood_bank_db;

# Create a user (optional but recommended)
CREATE USER bloodbank_user WITH PASSWORD 'bloodbank123';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE blood_bank_db TO bloodbank_user;

# Exit psql
\q
```

### Mac/Linux (Terminal)

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE blood_bank_db;

# Create user
CREATE USER bloodbank_user WITH PASSWORD 'bloodbank123';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE blood_bank_db TO bloodbank_user;

# Exit
\q
```

---

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

**Edit `.env` file and add:**

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blood_bank_db?schema=public"

# If you created a custom user:
# DATABASE_URL="postgresql://bloodbank_user:bloodbank123@localhost:5432/blood_bank_db?schema=public"

# Other environment variables (optional for now)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

**Important**: Replace `postgres:postgres` with your actual PostgreSQL username and password!

---

## Step 4: Install Project Dependencies

```bash
# Install all dependencies including Prisma
npm install
```

This installs:

- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI (dev dependency)
- `bcryptjs` - Password hashing
- `zod` - Runtime validation
- `ts-node` - TypeScript execution

---

## Step 5: Generate Prisma Client

```bash
# Generate Prisma Client from schema
npm run prisma:generate
```

This command:

- Reads `prisma/schema.prisma`
- Generates TypeScript types
- Creates the Prisma Client API

**Expected Output:**

```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

---

## Step 6: Run Database Migrations

### Option A: Development (Recommended for local setup)

```bash
# Push schema to database without creating migration files
npm run prisma:push
```

**Expected Output:**

```
✔ Prisma schema loaded from prisma/schema.prisma
✔ Datasource "db": PostgreSQL database "blood_bank_db"
✔ The database is now in sync with your schema
```

### Option B: Production-Style (Creates migration history)

```bash
# Create and apply migration
npm run prisma:migrate

# OR with a custom name:
npx prisma migrate dev --name init
```

**Expected Output:**

```
✔ Prisma schema loaded from prisma/schema.prisma
✔ Database schema created in the database
✔ Generated Prisma Client
```

---

## Step 7: Seed Database with Sample Data

```bash
# Run the seed script
npm run prisma:seed
```

**Expected Output:**

```
🌱 Starting database seed...
✅ Admin user created: admin@bloodbank.com
✅ Blood Bank created: Central Blood Bank
✅ Blood Bank created: Lifesaver Blood Bank
✅ Blood inventory created for: Central Blood Bank
✅ Blood inventory created for: Lifesaver Blood Bank
✅ Hospital created: City General Hospital
✅ Donor created: john.doe@example.com
✅ Donor created: jane.smith@example.com
✅ Sample donation created
✅ Sample campaign created
🎉 Database seeded successfully!
```

### Sample Data Created:

#### Users

| Email                  | Password | Role  | Blood Group |
| ---------------------- | -------- | ----- | ----------- |
| admin@bloodbank.com    | admin123 | ADMIN | -           |
| john.doe@example.com   | donor123 | DONOR | O+          |
| jane.smith@example.com | donor123 | DONOR | A+          |

#### Blood Banks

| Name                 | City      | Registration No |
| -------------------- | --------- | --------------- |
| Central Blood Bank   | Mumbai    | BB-MH-001-2024  |
| Lifesaver Blood Bank | New Delhi | BB-DL-002-2024  |

#### Hospital

| Name                  | City   | Registration No  |
| --------------------- | ------ | ---------------- |
| City General Hospital | Mumbai | HOSP-MH-001-2024 |

#### Blood Inventory

- All 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) for both blood banks
- Random quantities between 15-70 units

---

## Step 8: Verify Database Setup

### Method 1: Using Prisma Studio (Recommended)

```bash
# Open Prisma Studio in browser
npm run prisma:studio
```

This opens **http://localhost:5555** where you can:

- ✅ View all tables
- ✅ Browse records
- ✅ Edit data (be careful!)
- ✅ Verify relationships

**What to check:**

- [ ] Users table has 3 records
- [ ] BloodBank table has 2 records
- [ ] Hospital table has 1 record
- [ ] BloodInventory has 16 records (8 blood groups × 2 banks)
- [ ] Donation table has at least 1 record
- [ ] Campaign table has 1 record

### Method 2: Using psql Command Line

```bash
# Connect to database
psql -U postgres -d blood_bank_db

# List all tables
\dt

# Check users
SELECT id, email, role, "firstName", "lastName" FROM users;

# Check blood banks
SELECT id, name, city, "registrationNo" FROM blood_banks;

# Check blood inventory
SELECT bg."bloodGroup", bg.quantity, bb.name
FROM blood_inventory bg
JOIN blood_banks bb ON bg."bloodBankId" = bb.id;

# Exit
\q
```

### Method 3: Test with API (If Next.js is running)

```bash
# Start the development server
npm run dev

# In another terminal, test the API
curl http://localhost:3000/api/health
```

---

## Step 9: Verify Prisma Setup

Run these verification commands:

```bash
# 1. Check Prisma installation
npx prisma --version

# 2. Validate schema
npx prisma validate

# 3. Check database connection
npx prisma db pull

# 4. View database schema
npx prisma db execute --stdin < "SELECT version();"
```

---

## Common Commands Reference

### Database Management

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema (no migration files)
npm run prisma:push

# Create migration
npm run prisma:migrate

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ DELETES ALL DATA!)
npx prisma migrate reset
```

### Data Management

```bash
# Seed database
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio
```

### Schema Management

```bash
# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull current DB schema
npx prisma db pull
```

---

## Troubleshooting

### Issue 1: Connection Failed

**Error**: `Can't reach database server`

**Solutions**:

```bash
# Check if PostgreSQL is running
# Windows:
Get-Service -Name postgresql*

# Mac:
brew services list

# Linux:
sudo systemctl status postgresql

# Restart PostgreSQL
# Windows: Services app or
net start postgresql-x64-14

# Mac:
brew services restart postgresql@14

# Linux:
sudo systemctl restart postgresql
```

### Issue 2: Authentication Failed

**Error**: `password authentication failed`

**Solutions**:

1. Check your `.env` file has correct credentials
2. Verify PostgreSQL user exists:

```sql
psql -U postgres
\du  -- List all users
```

### Issue 3: Database Does Not Exist

**Error**: `database "blood_bank_db" does not exist`

**Solution**:

```bash
psql -U postgres
CREATE DATABASE blood_bank_db;
\q
```

### Issue 4: Permission Denied

**Error**: `permission denied for schema public`

**Solution**:

```sql
psql -U postgres -d blood_bank_db
GRANT ALL PRIVILEGES ON SCHEMA public TO bloodbank_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bloodbank_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bloodbank_user;
```

### Issue 5: Port Already in Use

**Error**: `port 5432 is already allocated`

**Solutions**:

```bash
# Find what's using the port
# Windows:
netstat -ano | findstr :5432

# Mac/Linux:
lsof -i :5432

# Change port in DATABASE_URL
DATABASE_URL="postgresql://user:pass@localhost:5433/blood_bank_db"
```

### Issue 6: Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:

```bash
npm run prisma:generate
npm install
```

---

## Verification Checklist

After completing all steps, verify:

### Database Level

- [ ] PostgreSQL is running
- [ ] Database `blood_bank_db` exists
- [ ] All 9 tables are created
- [ ] Foreign key relationships are intact

### Prisma Level

- [ ] Prisma Client is generated
- [ ] Schema is valid (`npx prisma validate`)
- [ ] Can connect to database (`npx prisma db pull`)
- [ ] Prisma Studio opens successfully

### Data Level

- [ ] 3 users exist (1 admin, 2 donors)
- [ ] 2 blood banks exist
- [ ] 1 hospital exists
- [ ] 16 inventory records exist (8 per bank)
- [ ] 1 donation record exists
- [ ] 1 campaign exists

### Application Level

- [ ] Next.js server starts without errors
- [ ] Can import Prisma client in code
- [ ] No TypeScript errors in schema-related files

---

## Next Steps After Setup

1. **Explore the Database**

   ```bash
   npm run prisma:studio
   ```

2. **Test Authentication**

   - Try logging in with sample users
   - Verify password hashing works

3. **Test API Routes**

   - Create example API endpoints
   - Test CRUD operations

4. **Build Frontend Forms**

   - User registration
   - Blood request forms
   - Donation scheduling

5. **Add Validation**
   - Use Zod schemas from `src/types/index.ts`
   - Validate inputs before database operations

---

## Useful Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project Database Schema](./database-schema-reference.md)
- [API Examples](./api-examples.ts)

---

## Quick Start Summary

```bash
# 1. Create database
psql -U postgres
CREATE DATABASE blood_bank_db;
\q

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. Install dependencies
npm install

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Create tables
npm run prisma:push

# 6. Seed data
npm run prisma:seed

# 7. Verify
npm run prisma:studio

# 8. Start development
npm run dev
```

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Verify PostgreSQL is running
4. Check `.env` configuration
5. Ensure all dependencies are installed

**Database is now ready for development!** 🎉
