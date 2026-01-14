#!/bin/bash

# 🚀 Automated Database Setup Script
# This script automates the entire database setup process

set -e  # Exit on any error

echo "🚀 BloodLink Automated Database Setup"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Step 1: Check .env file
echo -e "${YELLOW}📝 Step 1: Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    echo -e "   ${YELLOW}⚠️  Please edit .env file with your DATABASE_URL${NC}"
    echo -e "   ${CYAN}Example: DATABASE_URL='postgresql://postgres:password@localhost:5432/blood_bank_db'${NC}"
    echo ""
    echo -e "   ${YELLOW}Press Enter after updating .env file...${NC}"
    read
else
    echo -e "   ${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
if npm install; then
    echo -e "   ${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "   ${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 3: Generate Prisma Client
echo -e "${YELLOW}🔧 Step 3: Generating Prisma Client...${NC}"
if npm run prisma:generate; then
    echo -e "   ${GREEN}✅ Prisma Client generated successfully${NC}"
else
    echo -e "   ${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Step 4: Push schema to database
echo -e "${YELLOW}🗄️  Step 4: Creating database tables...${NC}"
echo "   This will create all tables in your database"
if npm run prisma:push; then
    echo -e "   ${GREEN}✅ Database tables created successfully${NC}"
else
    echo -e "   ${RED}❌ Failed to create database tables${NC}"
    echo ""
    echo -e "   ${YELLOW}Troubleshooting tips:${NC}"
    echo "   1. Make sure PostgreSQL is running"
    echo "   2. Check your DATABASE_URL in .env"
    echo "   3. Verify database 'blood_bank_db' exists"
    exit 1
fi
echo ""

# Step 5: Seed database
echo -e "${YELLOW}🌱 Step 5: Seeding database with sample data...${NC}"
if npm run prisma:seed; then
    echo -e "   ${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "   ${RED}❌ Failed to seed database${NC}"
fi
echo ""

# Step 6: Summary
echo "====================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Sample Credentials:${NC}"
echo "  Admin:  admin@bloodbank.com / admin123"
echo "  Donor:  john.doe@example.com / donor123"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. View database:  ${CYAN}npm run prisma:studio${NC}"
echo -e "  2. Start dev server: ${CYAN}npm run dev${NC}"
echo -e "  3. Open browser:    ${CYAN}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  - docs/LOCAL-SETUP-GUIDE.md"
echo "  - docs/database-schema-reference.md"
echo "  - docs/api-examples.ts"
echo ""

# Ask if user wants to open Prisma Studio
echo -e "${YELLOW}Would you like to open Prisma Studio now? (y/n)${NC}"
read -r response
if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    echo -e "${CYAN}Opening Prisma Studio...${NC}"
    npm run prisma:studio
fi
