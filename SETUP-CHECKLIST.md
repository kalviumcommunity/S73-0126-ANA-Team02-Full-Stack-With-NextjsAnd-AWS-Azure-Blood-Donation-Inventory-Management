# 🚀 Database Setup Checklist

## Step 1: Create PostgreSQL Database ✅

**Option A: Using pgAdmin (Recommended)**

1. Open **pgAdmin 4** from Start menu
2. Connect to localhost server
3. Right-click **Databases** → **Create** → **Database**
4. Name: `blood_bank_db`
5. Click **Save**

**Option B: Using SQL Shell**

1. Open **SQL Shell (psql)** from Start menu
2. Press Enter for defaults (Server, Database, Port, Username)
3. Enter your PostgreSQL password
4. Run:

```sql
CREATE DATABASE blood_bank_db;
\q
```

## Step 2: Configure Environment File 🔐

1. Open `.env` in your editor
2. Update line 12 with your actual password:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/blood_bank_db?schema=public"
```

Replace `YOUR_PASSWORD_HERE` with the password you set during PostgreSQL installation.

**Example:**

```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/blood_bank_db?schema=public"
```

## Step 3: Run Database Setup 🗄️

Open PowerShell in the project directory and run:

```powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed sample data
npm run prisma:seed

# Open database GUI
npm run prisma:studio
```

**Or use the one-command setup:**

```powershell
npm run db:setup
npm run prisma:studio
```

## Step 4: Verify Setup ✅

After running the commands, you should see:

✅ **12 tables created:**

- users
- blood_banks
- hospitals
- blood_inventory
- blood_requests
- donations
- campaigns
- notifications
- audit_logs

✅ **Sample data seeded:**

- 3 Users (1 Admin, 2 Donors)
- 2 Blood Banks
- 1 Hospital
- 16 Inventory Records
- 1 Donation
- 1 Campaign

✅ **Prisma Studio opens at http://localhost:5555**

## Troubleshooting 🔧

### Error: "Can't reach database server"

- ✅ Check PostgreSQL is running
- ✅ Verify DATABASE_URL in `.env`
- ✅ Confirm database `blood_bank_db` exists
- ✅ Check password is correct

### Error: "P1001: Can't reach database"

```powershell
# Restart PostgreSQL
net stop postgresql-x64-16
net start postgresql-x64-16
```

### Error: "Database does not exist"

Create the database using pgAdmin or SQL Shell (see Step 1)

## Next Steps 🎯

1. ✅ Explore database in Prisma Studio
2. 📚 Review [Database Schema Reference](docs/database-schema-reference.md)
3. 💻 Check [API Examples](docs/api-examples.ts)
4. 🚀 Start development: `npm run dev`

## Test Credentials 🔐

```
Admin:
  Email: admin@bloodbank.com
  Password: admin123

Donor 1:
  Email: john.doe@example.com
  Password: donor123

Donor 2:
  Email: jane.smith@example.com
  Password: donor123
```

---

**Need help?** See [LOCAL-SETUP-GUIDE.md](docs/LOCAL-SETUP-GUIDE.md) for detailed instructions.
