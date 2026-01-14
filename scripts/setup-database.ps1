# 🚀 Automated Database Setup Script
# This script automates the entire database setup process

Write-Host "🚀 BloodLink Automated Database Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Step 1: Check .env file
Write-Host "📝 Step 1: Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "   Creating .env from .env.example..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
    Write-Host "   ⚠️  Please edit .env file with your DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   Example: DATABASE_URL='postgresql://postgres:password@localhost:5432/blood_bank_db'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Press Enter after updating .env file..." -ForegroundColor Yellow
    Read-Host
} else {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
}
Write-Host ""

# Step 2: Install dependencies
Write-Host "📦 Step 2: Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Generate Prisma Client
Write-Host "🔧 Step 3: Generating Prisma Client..." -ForegroundColor Yellow
try {
    npm run prisma:generate
    Write-Host "   ✅ Prisma Client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Push schema to database
Write-Host "🗄️  Step 4: Creating database tables..." -ForegroundColor Yellow
Write-Host "   This will create all tables in your database" -ForegroundColor Gray
try {
    npm run prisma:push
    Write-Host "   ✅ Database tables created successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to create database tables" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "   1. Make sure PostgreSQL is running" -ForegroundColor White
    Write-Host "   2. Check your DATABASE_URL in .env" -ForegroundColor White
    Write-Host "   3. Verify database 'blood_bank_db' exists" -ForegroundColor White
    exit 1
}
Write-Host ""

# Step 5: Seed database
Write-Host "🌱 Step 5: Seeding database with sample data..." -ForegroundColor Yellow
try {
    npm run prisma:seed
    Write-Host "   ✅ Database seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to seed database" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Step 6: Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Sample Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:  admin@bloodbank.com / admin123" -ForegroundColor White
Write-Host "  Donor:  john.doe@example.com / donor123" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. View database:  npm run prisma:studio" -ForegroundColor Cyan
Write-Host "  2. Start dev server: npm run dev" -ForegroundColor Cyan
Write-Host "  3. Open browser:    http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  - docs/LOCAL-SETUP-GUIDE.md" -ForegroundColor White
Write-Host "  - docs/database-schema-reference.md" -ForegroundColor White
Write-Host "  - docs/api-examples.ts" -ForegroundColor White
Write-Host ""

# Ask if user wants to open Prisma Studio
Write-Host "Would you like to open Prisma Studio now? (Y/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Opening Prisma Studio..." -ForegroundColor Cyan
    npm run prisma:studio
}
