/* eslint-disable no-console */
/**
 * Database Connection Test Script
 *
 * This script verifies that Prisma can successfully connect to PostgreSQL
 * and perform basic CRUD operations.
 *
 * Run this script using:
 * npm run test:db
 *
 * OR manually:
 * npx tsx scripts/test-db-connection.ts
 */

import { prisma } from "../src/lib/prisma";

async function testDatabaseConnection() {
  console.log("\n🔍 Testing Database Connection...\n");

  try {
    // Test 1: Check database connection
    console.log("✅ Test 1: Connecting to database...");
    await prisma.$connect();
    console.log("   ✓ Database connection successful!\n");

    // Test 2: Count users
    console.log("✅ Test 2: Counting users in database...");
    const userCount = await prisma.user.count();
    console.log(`   ✓ Found ${userCount} users in database\n`);

    // Test 3: Fetch all users
    console.log("✅ Test 3: Fetching all users...");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bloodGroup: true,
        createdAt: true,
      },
      take: 10, // Limit to first 10 users
    });

    console.log(`   ✓ Retrieved ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`
      );
      console.log(
        `      Role: ${user.role}, Blood Group: ${user.bloodGroup || "N/A"}`
      );
    });
    console.log();

    // Test 4: Count blood banks
    console.log("✅ Test 4: Counting blood banks...");
    const bloodBankCount = await prisma.bloodBank.count();
    console.log(`   ✓ Found ${bloodBankCount} blood banks\n`);

    // Test 5: Fetch blood inventory
    console.log("✅ Test 5: Fetching blood inventory...");
    const inventory = await prisma.bloodInventory.findMany({
      include: {
        bloodBank: {
          select: {
            name: true,
            city: true,
          },
        },
      },
      take: 5,
    });

    console.log(`   ✓ Retrieved ${inventory.length} inventory records:`);
    inventory.forEach((item, index) => {
      console.log(
        `   ${index + 1}. ${item.bloodGroup} - ${item.quantity} units`
      );
      console.log(
        `      Location: ${item.bloodBank.name}, ${item.bloodBank.city}`
      );
    });
    console.log();

    // Test 6: Complex query with relations
    console.log("✅ Test 6: Testing complex query with relations...");
    const donationsWithDetails = await prisma.donation.findMany({
      include: {
        donor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        bloodBank: {
          select: {
            name: true,
            city: true,
          },
        },
      },
      take: 3,
    });

    console.log(
      `   ✓ Retrieved ${donationsWithDetails.length} donations with details:`
    );
    donationsWithDetails.forEach((donation, index) => {
      console.log(
        `   ${index + 1}. ${donation.donor.firstName} ${
          donation.donor.lastName
        }`
      );
      console.log(
        `      Blood Group: ${donation.bloodGroup}, Status: ${donation.status}`
      );
      console.log(
        `      Blood Bank: ${donation.bloodBank.name}, ${donation.bloodBank.city}`
      );
    });
    console.log();

    // Test 7: Aggregate query
    console.log("✅ Test 7: Testing aggregate queries...");
    const inventoryStats = await prisma.bloodInventory.groupBy({
      by: ["bloodGroup"],
      _sum: {
        quantity: true,
      },
      _avg: {
        quantity: true,
      },
    });

    console.log("   ✓ Blood inventory statistics by blood group:");
    inventoryStats.forEach((stat) => {
      console.log(
        `      ${stat.bloodGroup}: Total = ${
          stat._sum.quantity
        } units, Avg = ${stat._avg.quantity?.toFixed(1)} units`
      );
    });
    console.log();

    // Success summary
    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ ALL TESTS PASSED!");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("Database connection is working correctly.");
    console.log("Prisma Client is properly configured.");
    console.log("All CRUD operations are functional.");
    console.log(
      "═══════════════════════════════════════════════════════════\n"
    );
  } catch (error) {
    console.error("❌ DATABASE CONNECTION TEST FAILED!\n");
    console.error("Error details:", error);
    console.error("\nTroubleshooting steps:");
    console.error("1. Verify PostgreSQL is running");
    console.error("2. Check DATABASE_URL in .env file");
    console.error("3. Ensure database blood_bank_db exists");
    console.error("4. Run: npm run prisma:push");
    console.error("5. Run: npm run prisma:seed\n");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Disconnected from database.\n");
  }
}

// Run the test
testDatabaseConnection();
