/* eslint-disable no-console */
/**
 * Prisma Transaction Example: Blood Request with Inventory Management
 *
 * This demonstrates how to use Prisma transactions to ensure data consistency
 * when performing multiple related database operations.
 *
 * Scenario: A hospital places a blood request and inventory must be decremented.
 * Both operations must succeed or fail together (atomicity).
 */

import { prisma } from "../src/lib/prisma";
import { BloodGroup, RequestStatus } from "@prisma/client";

/**
 * Creates a blood request and decrements inventory in a single transaction
 *
 * @param requestData - Blood request details
 * @returns The created blood request with updated inventory
 *
 * Transaction Behavior:
 * - If inventory decrement fails → blood request is NOT created (rollback)
 * - If blood request creation fails → inventory is NOT decremented (rollback)
 * - Both operations succeed together or fail together (atomicity)
 */
async function createBloodRequestWithInventoryUpdate(requestData: {
  requesterId: string;
  bloodBankId: string;
  bloodGroup: BloodGroup;
  quantityNeeded: number;
  patientName: string;
  patientAge: number;
  purpose: string;
  requiredBy: Date;
}) {
  try {
    console.log("\n🔄 Starting transaction...");
    console.log("📋 Request details:", {
      bloodGroup: requestData.bloodGroup,
      quantity: requestData.quantityNeeded,
      patient: requestData.patientName,
    });

    // Execute both operations in a transaction
    // If ANY operation fails, ALL changes are rolled back automatically
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Check if sufficient inventory exists
      console.log("\n✓ Step 1: Checking inventory availability...");
      const inventory = await tx.bloodInventory.findUnique({
        where: {
          bloodBankId_bloodGroup: {
            bloodBankId: requestData.bloodBankId,
            bloodGroup: requestData.bloodGroup,
          },
        },
      });

      if (!inventory) {
        throw new Error(
          `No inventory found for ${requestData.bloodGroup} at this blood bank`
        );
      }

      if (inventory.quantity < requestData.quantityNeeded) {
        throw new Error(
          `Insufficient inventory: Available ${inventory.quantity} units, Requested ${requestData.quantityNeeded} units`
        );
      }

      console.log(
        `  ✓ Available: ${inventory.quantity} units, Requested: ${requestData.quantityNeeded} units`
      );

      // Step 2: Create the blood request
      console.log("\n✓ Step 2: Creating blood request...");
      const bloodRequest = await tx.bloodRequest.create({
        data: {
          requesterId: requestData.requesterId,
          bloodBankId: requestData.bloodBankId,
          bloodGroup: requestData.bloodGroup,
          quantityNeeded: requestData.quantityNeeded,
          patientName: requestData.patientName,
          patientAge: requestData.patientAge,
          purpose: requestData.purpose,
          requiredBy: requestData.requiredBy,
          urgency: "NORMAL",
          status: RequestStatus.APPROVED, // Auto-approve for demo
        },
        include: {
          requester: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      console.log(`  ✓ Blood request created: ID ${bloodRequest.id}`);

      // Step 3: Decrement inventory
      console.log("\n✓ Step 3: Decrementing inventory...");
      const updatedInventory = await tx.bloodInventory.update({
        where: {
          bloodBankId_bloodGroup: {
            bloodBankId: requestData.bloodBankId,
            bloodGroup: requestData.bloodGroup,
          },
        },
        data: {
          quantity: {
            decrement: requestData.quantityNeeded,
          },
        },
      });

      console.log(
        `  ✓ Inventory updated: ${inventory.quantity} → ${updatedInventory.quantity} units`
      );

      // Return both results
      return {
        bloodRequest,
        previousInventory: inventory.quantity,
        currentInventory: updatedInventory.quantity,
        unitsDecremented: requestData.quantityNeeded,
      };
    });

    // Transaction succeeded - both operations completed
    console.log("\n✅ Transaction committed successfully!");
    console.log("═══════════════════════════════════════════");
    console.log("✓ Blood request created");
    console.log("✓ Inventory decremented");
    console.log("✓ Data consistency maintained");
    console.log("═══════════════════════════════════════════\n");

    return result;
  } catch (error) {
    // Transaction failed - all changes rolled back automatically
    console.error("\n❌ Transaction failed and rolled back!");
    console.error("═══════════════════════════════════════════");
    console.error("✗ No blood request created");
    console.error("✗ No inventory changes");
    console.error("✗ Database state unchanged");
    console.error("═══════════════════════════════════════════");
    console.error("\nError:", error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Demo: Successful Transaction
 * Both operations succeed
 */
async function demoSuccessfulTransaction() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   DEMO 1: SUCCESSFUL TRANSACTION           ║");
  console.log("╚════════════════════════════════════════════╝");

  try {
    // Get test data
    const donor = await prisma.user.findFirst({
      where: { role: "DONOR" },
    });

    const bloodBank = await prisma.bloodBank.findFirst();

    if (!donor || !bloodBank) {
      throw new Error("Test data not found. Please run: npm run prisma:seed");
    }

    // Create request with sufficient inventory
    const result = await createBloodRequestWithInventoryUpdate({
      requesterId: donor.id,
      bloodBankId: bloodBank.id,
      bloodGroup: BloodGroup.O_POSITIVE,
      quantityNeeded: 2,
      patientName: "Test Patient",
      patientAge: 45,
      purpose: "Surgery preparation",
      requiredBy: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    });

    console.log("\n📊 Transaction Result:");
    console.log(`   Request ID: ${result.bloodRequest.id}`);
    console.log(`   Patient: ${result.bloodRequest.patientName}`);
    console.log(`   Blood Group: ${result.bloodRequest.bloodGroup}`);
    console.log(`   Quantity: ${result.bloodRequest.quantityNeeded} units`);
    console.log(
      `   Inventory: ${result.previousInventory} → ${result.currentInventory} units`
    );
  } catch (error) {
    console.error("Demo 1 failed:", error);
  }
}

/**
 * Demo: Failed Transaction (Insufficient Inventory)
 * Transaction rolls back - no changes made
 */
async function demoFailedTransaction() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   DEMO 2: FAILED TRANSACTION (ROLLBACK)    ║");
  console.log("╚════════════════════════════════════════════╝");

  try {
    const donor = await prisma.user.findFirst({
      where: { role: "DONOR" },
    });

    const bloodBank = await prisma.bloodBank.findFirst();

    if (!donor || !bloodBank) {
      throw new Error("Test data not found");
    }

    // Try to request more units than available
    await createBloodRequestWithInventoryUpdate({
      requesterId: donor.id,
      bloodBankId: bloodBank.id,
      bloodGroup: BloodGroup.O_POSITIVE,
      quantityNeeded: 999, // Intentionally too many units
      patientName: "Test Patient 2",
      patientAge: 50,
      purpose: "Emergency",
      requiredBy: new Date(),
    });
  } catch (error) {
    // Expected to fail
    console.log("\n✓ Transaction correctly rolled back");
    console.log("✓ No data was modified");
    console.log("✓ Database integrity maintained\n");
  }
}

/**
 * Verify database state after transactions
 */
async function verifyDatabaseState() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   DATABASE STATE VERIFICATION              ║");
  console.log("╚════════════════════════════════════════════╝\n");

  const bloodBank = await prisma.bloodBank.findFirst({
    include: {
      inventory: {
        where: { bloodGroup: BloodGroup.O_POSITIVE },
      },
      bloodRequests: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (bloodBank) {
    console.log(`Blood Bank: ${bloodBank.name}`);
    console.log(`O+ Inventory: ${bloodBank.inventory[0]?.quantity || 0} units`);
    console.log(`Pending Requests: ${bloodBank.bloodRequests.length}`);
  }

  console.log("\n");
}

/**
 * Main execution
 */
async function main() {
  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   PRISMA TRANSACTION DEMONSTRATION");
  console.log("   Blood Request with Inventory Management");
  console.log("═══════════════════════════════════════════════════════════");

  try {
    await demoSuccessfulTransaction();
    await demoFailedTransaction();
    await verifyDatabaseState();

    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ DEMONSTRATION COMPLETED");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("\nKey Takeaways:");
    console.log("1. Transactions ensure atomicity (all-or-nothing)");
    console.log("2. Failed operations trigger automatic rollback");
    console.log("3. Data consistency is always maintained");
    console.log("4. No partial updates can occur");
    console.log(
      "═══════════════════════════════════════════════════════════\n"
    );
  } catch (error) {
    console.error("\n❌ Demonstration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the demonstration
main();
