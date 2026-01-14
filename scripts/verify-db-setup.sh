#!/bin/bash

# 🔍 BloodLink Database Verification Script
# Run this after setting up your database to verify everything is working

echo "🔍 BloodLink Database Verification"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if .env file exists
echo -e "${YELLOW}1. Checking .env file...${NC}"
if [ -f ".env" ]; then
    echo -e "   ${GREEN}✅ .env file exists${NC}"
    if grep -q "DATABASE_URL" .env; then
        echo -e "   ${GREEN}✅ DATABASE_URL is configured${NC}"
    else
        echo -e "   ${RED}❌ DATABASE_URL not found in .env${NC}"
        echo -e "   ${YELLOW}Please add DATABASE_URL to your .env file${NC}"
    fi
else
    echo -e "   ${RED}❌ .env file not found${NC}"
    echo -e "   ${YELLOW}Run: cp .env.example .env${NC}"
fi
echo ""

# Check if node_modules exists
echo -e "${YELLOW}2. Checking dependencies...${NC}"
if [ -d "node_modules/@prisma/client" ]; then
    echo -e "   ${GREEN}✅ Prisma Client is installed${NC}"
else
    echo -e "   ${RED}❌ Prisma Client not found${NC}"
    echo -e "   ${YELLOW}Run: npm install${NC}"
fi
echo ""

# Check if Prisma is installed
echo -e "${YELLOW}3. Checking Prisma CLI...${NC}"
if command -v npx &> /dev/null; then
    PRISMA_VERSION=$(npx prisma --version 2>&1 | grep "prisma" | head -n 1)
    if [ ! -z "$PRISMA_VERSION" ]; then
        echo -e "   ${GREEN}✅ Prisma CLI is available${NC}"
        echo -e "   ${CYAN}Version: $PRISMA_VERSION${NC}"
    fi
else
    echo -e "   ${RED}❌ npx not found${NC}"
fi
echo ""

# Validate Prisma schema
echo -e "${YELLOW}4. Validating Prisma schema...${NC}"
VALIDATION=$(npx prisma validate 2>&1)
if echo "$VALIDATION" | grep -q "validated successfully"; then
    echo -e "   ${GREEN}✅ Schema is valid${NC}"
else
    echo -e "   ${RED}❌ Schema validation failed${NC}"
    echo -e "   ${RED}$VALIDATION${NC}"
fi
echo ""

# Check database connection
echo -e "${YELLOW}5. Testing database connection...${NC}"
DB_TEST=$(npx prisma db pull --force 2>&1)
if echo "$DB_TEST" | grep -q "Introspected\|Pulling schema"; then
    echo -e "   ${GREEN}✅ Database connection successful${NC}"
else
    echo -e "   ${RED}❌ Database connection failed${NC}"
    echo -e "   ${YELLOW}Make sure PostgreSQL is running${NC}"
fi
echo ""

# Check if tables exist
echo -e "${YELLOW}6. Checking database tables...${NC}"
echo -e "   ${CYAN}Run this command to view tables:${NC}"
echo -e "   ${CYAN}npm run prisma:studio${NC}"
echo ""

# Summary
echo "================================="
echo -e "${CYAN}Verification Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. If .env is missing: cp .env.example .env"
echo "2. If dependencies missing: npm install"
echo "3. Generate Prisma Client: npm run prisma:generate"
echo "4. Create tables: npm run prisma:push"
echo "5. Seed data: npm run prisma:seed"
echo "6. View database: npm run prisma:studio"
echo ""
echo -e "${YELLOW}For detailed setup instructions, see:${NC}"
echo -e "${CYAN}docs/LOCAL-SETUP-GUIDE.md${NC}"
echo ""
