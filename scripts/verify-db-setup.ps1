# 🔍 Database Verification Script
# Run this after setting up your database to verify everything is working

Write-Host "🔍 BloodLink Database Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
Write-Host "1. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    $envContent = Get-Content ".env" | Select-String "DATABASE_URL"
    if ($envContent) {
        Write-Host "   ✅ DATABASE_URL is configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ DATABASE_URL not found in .env" -ForegroundColor Red
        Write-Host "   Please add DATABASE_URL to your .env file" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    Write-Host "   Run: Copy-Item .env.example .env" -ForegroundColor Yellow
}
Write-Host ""

# Check if node_modules exists
Write-Host "2. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules/@prisma/client") {
    Write-Host "   ✅ Prisma Client is installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Prisma Client not found" -ForegroundColor Red
    Write-Host "   Run: npm install" -ForegroundColor Yellow
}
Write-Host ""

# Check if Prisma is installed globally
Write-Host "3. Checking Prisma CLI..." -ForegroundColor Yellow
try {
    $prismaVersion = npx prisma --version 2>&1 | Select-String "prisma"
    if ($prismaVersion) {
        Write-Host "   ✅ Prisma CLI is available" -ForegroundColor Green
        Write-Host "   Version: $($prismaVersion -replace 'prisma\s+:\s+')" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Prisma CLI not found" -ForegroundColor Red
}
Write-Host ""

# Validate Prisma schema
Write-Host "4. Validating Prisma schema..." -ForegroundColor Yellow
try {
    $validation = npx prisma validate 2>&1
    if ($validation -match "validated successfully") {
        Write-Host "   ✅ Schema is valid" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Schema validation failed" -ForegroundColor Red
        Write-Host "   $validation" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Could not validate schema" -ForegroundColor Red
}
Write-Host ""

# Check database connection
Write-Host "5. Testing database connection..." -ForegroundColor Yellow
try {
    $dbTest = npx prisma db pull --force 2>&1
    if ($dbTest -match "Introspected|Pulling schema") {
        Write-Host "   ✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Database connection failed" -ForegroundColor Red
        Write-Host "   Make sure PostgreSQL is running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Could not connect to database" -ForegroundColor Red
    Write-Host "   Check your DATABASE_URL in .env" -ForegroundColor Yellow
}
Write-Host ""

# Check if tables exist
Write-Host "6. Checking database tables..." -ForegroundColor Yellow
Write-Host "   Run this command to view tables:" -ForegroundColor Gray
Write-Host "   npm run prisma:studio" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If .env is missing: Copy-Item .env.example .env" -ForegroundColor White
Write-Host "2. If dependencies missing: npm install" -ForegroundColor White
Write-Host "3. Generate Prisma Client: npm run prisma:generate" -ForegroundColor White
Write-Host "4. Create tables: npm run prisma:push" -ForegroundColor White
Write-Host "5. Seed data: npm run prisma:seed" -ForegroundColor White
Write-Host "6. View database: npm run prisma:studio" -ForegroundColor White
Write-Host ""
Write-Host "For detailed setup instructions, see:" -ForegroundColor Yellow
Write-Host "docs/LOCAL-SETUP-GUIDE.md" -ForegroundColor Cyan
Write-Host ""
