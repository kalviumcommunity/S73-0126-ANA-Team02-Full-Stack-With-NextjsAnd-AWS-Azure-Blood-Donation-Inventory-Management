# ⚡ Quick Command Reference

## 🚀 One-Command Setup (Automated)

### Windows (PowerShell)
```powershell
.\scripts\setup-database.ps1
```

### Mac/Linux
```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

---

## 📋 Manual Setup Commands

### 1. Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your DATABASE_URL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/blood_bank_db"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Create Database Tables
```bash
# Option A: Quick push (development)
npm run prisma:push

# Option B: With migration history (production-style)
npx prisma migrate dev --name init
```

### 5. Seed Sample Data
```bash
npm run prisma:seed
```

### 6. Verify Setup
```bash
# Open Prisma Studio GUI
npm run prisma:studio

# Or run verification script
# Windows:
.\scripts\verify-db-setup.ps1

# Mac/Linux:
./scripts/verify-db-setup.sh
```

---

## 🔧 Common Prisma Commands

### Database Operations
| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema to DB (no migration) |
| `npm run prisma:migrate` | Create migration |
| `npm run prisma:studio` | Open database GUI |
| `npm run prisma:seed` | Populate sample data |

### Schema Management
| Command | Description |
|---------|-------------|
| `npx prisma format` | Format schema file |
| `npx prisma validate` | Validate schema |
| `npx prisma db pull` | Pull schema from DB |

### Database Reset (⚠️ Deletes Data!)
```bash
npx prisma migrate reset
```

---

## 🔍 Verification Commands

### Check Database Connection
```bash
npx prisma db pull
```

### View Database Version
```bash
psql -U postgres -c "SELECT version();"
```

### List All Tables
```bash
psql -U postgres -d blood_bank_db -c "\dt"
```

### Count Records
```bash
psql -U postgres -d blood_bank_db -c "SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM blood_banks) as blood_banks,
  (SELECT COUNT(*) FROM hospitals) as hospitals,
  (SELECT COUNT(*) FROM blood_inventory) as inventory,
  (SELECT COUNT(*) FROM donations) as donations;"
```

---

## 📊 Sample Data Overview

After seeding, you'll have:

| Entity | Count | Details |
|--------|-------|---------|
| **Users** | 3 | 1 Admin, 2 Donors |
| **Blood Banks** | 2 | Mumbai & Delhi |
| **Hospitals** | 1 | Mumbai |
| **Inventory** | 16 | 8 blood groups × 2 banks |
| **Donations** | 1 | Sample completed donation |
| **Campaigns** | 1 | Sample donation drive |

### Sample Credentials

```
Admin:
  Email: admin@bloodbank.com
  Password: admin123

Donor 1:
  Email: john.doe@example.com
  Password: donor123
  Blood Group: O+

Donor 2:
  Email: jane.smith@example.com
  Password: donor123
  Blood Group: A+
```

---

## 🔧 Troubleshooting Quick Fixes

### Connection Failed
```bash
# Windows - Start PostgreSQL
net start postgresql-x64-14

# Mac - Start PostgreSQL
brew services start postgresql@14

# Linux - Start PostgreSQL
sudo systemctl start postgresql
```

### Database Doesn't Exist
```bash
psql -U postgres
CREATE DATABASE blood_bank_db;
\q
```

### Permission Denied
```bash
psql -U postgres -d blood_bank_db
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
\q
```

### Prisma Client Not Found
```bash
npm run prisma:generate
npm install
```

### Port 5432 Already in Use
```bash
# Find process using port 5432
# Windows:
netstat -ano | findstr :5432

# Mac/Linux:
lsof -i :5432
```

---

## 🎯 Quick Start (Copy & Paste)

```bash
# Complete setup in one go
npm install && \
npm run prisma:generate && \
npm run prisma:push && \
npm run prisma:seed && \
npm run prisma:studio
```

---

## 📚 Documentation Links

- **Setup Guide**: [docs/LOCAL-SETUP-GUIDE.md](./LOCAL-SETUP-GUIDE.md)
- **Schema Reference**: [docs/database-schema-reference.md](./database-schema-reference.md)
- **API Examples**: [docs/api-examples.ts](./api-examples.ts)
- **ER Diagram**: [docs/database-er-diagram.md](./database-er-diagram.md)

---

## 💡 Pro Tips

1. **Always** generate Prisma Client after schema changes
2. Use `prisma:push` in development, `prisma:migrate` in production
3. Run `prisma:studio` to visually inspect database
4. Back up data before running `prisma migrate reset`
5. Use transactions for related database operations

---

## ✅ Health Check

Run this to verify everything is working:

```bash
# 1. Check Prisma
npx prisma --version

# 2. Validate schema
npx prisma validate

# 3. Test connection
npx prisma db pull

# 4. View data
npm run prisma:studio
```

---

**Need help?** See [docs/LOCAL-SETUP-GUIDE.md](./LOCAL-SETUP-GUIDE.md) for detailed instructions.
