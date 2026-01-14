/**
 * Example API Route Implementations
 *
 * This file demonstrates how to use Prisma with Next.js API routes
 * for common blood bank operations.
 *
 * These are example patterns - adapt them to your actual API structure.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BloodGroup, RequestStatus, DonationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

// ============================================
// EXAMPLE 1: Get Blood Availability by City
// ============================================
// Route: GET /api/blood-availability?city=Mumbai&bloodGroup=O_POSITIVE

export async function getBloodAvailability(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");
    const bloodGroup = searchParams.get("bloodGroup") as BloodGroup | null;

    const inventory = await prisma.bloodInventory.findMany({
      where: {
        ...(bloodGroup && { bloodGroup }),
        quantity: { gt: 0 },
        bloodBank: {
          ...(city && { city }),
          isActive: true,
          isVerified: true,
        },
      },
      include: {
        bloodBank: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            phone: true,
            operatingHours: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: {
        quantity: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: inventory,
      count: inventory.length,
    });
  } catch (error) {
    console.error("Error fetching blood availability:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blood availability" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 2: Create Blood Request
// ============================================
// Route: POST /api/blood-requests

export async function createBloodRequest(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      requesterId,
      hospitalId,
      bloodGroup,
      quantityNeeded,
      urgency,
      patientName,
      patientAge,
      patientGender,
      requiredBy,
      purpose,
      medicalNotes,
      doctorName,
      doctorContact,
    } = body;

    // Validate required fields
    if (
      !requesterId ||
      !bloodGroup ||
      !quantityNeeded ||
      !patientName ||
      !requiredBy
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the blood request
    const bloodRequest = await prisma.bloodRequest.create({
      data: {
        requesterId,
        hospitalId,
        bloodGroup,
        quantityNeeded,
        urgency: urgency || "NORMAL",
        patientName,
        patientAge,
        patientGender,
        requiredBy: new Date(requiredBy),
        purpose,
        medicalNotes,
        doctorName,
        doctorContact,
        status: RequestStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        hospital: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: bloodRequest,
      message: "Blood request created successfully",
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blood request" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 3: Schedule Donation
// ============================================
// Route: POST /api/donations/schedule

export async function scheduleDonation(request: NextRequest) {
  try {
    const body = await request.json();
    const { donorId, bloodBankId, scheduledDate, notes } = body;

    // Validate donor exists and has blood group
    const donor = await prisma.user.findUnique({
      where: { id: donorId },
      select: {
        bloodGroup: true,
        lastDonation: true,
      },
    });

    if (!donor || !donor.bloodGroup) {
      return NextResponse.json(
        { success: false, error: "Donor not found or blood group not set" },
        { status: 400 }
      );
    }

    // Check if donor is eligible (90 days since last donation)
    if (donor.lastDonation) {
      const daysSinceLastDonation = Math.floor(
        (Date.now() - donor.lastDonation.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastDonation < 90) {
        return NextResponse.json(
          {
            success: false,
            error: `Not eligible to donate yet. Please wait ${
              90 - daysSinceLastDonation
            } more days.`,
          },
          { status: 400 }
        );
      }
    }

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        donorId,
        bloodBankId,
        bloodGroup: donor.bloodGroup,
        scheduledDate: new Date(scheduledDate),
        status: DonationStatus.SCHEDULED,
        preTestNotes: notes,
      },
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            bloodGroup: true,
          },
        },
        bloodBank: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: donation,
      message: "Donation scheduled successfully",
    });
  } catch (error) {
    console.error("Error scheduling donation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to schedule donation" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 4: Complete Donation & Update Inventory
// ============================================
// Route: POST /api/donations/:id/complete

export async function completeDonation(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      hemoglobinLevel,
      bloodPressure,
      weight,
      temperature,
      isEligible,
      unitSerialNumber,
      collectedBy,
    } = body;

    // Get donation details
    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
      include: {
        donor: true,
      },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    // Use transaction to update both donation and inventory
    const result = await prisma.$transaction(async (tx) => {
      // Update donation record
      const updatedDonation = await tx.donation.update({
        where: { id: params.id },
        data: {
          status: DonationStatus.COMPLETED,
          donationDate: new Date(),
          hemoglobinLevel,
          bloodPressure,
          weight,
          temperature,
          isEligible,
          unitSerialNumber,
          collectedBy,
          expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days
        },
      });

      // Update inventory if donation was successful
      if (isEligible) {
        await tx.bloodInventory.upsert({
          where: {
            bloodBankId_bloodGroup: {
              bloodBankId: donation.bloodBankId,
              bloodGroup: donation.bloodGroup,
            },
          },
          update: {
            quantity: { increment: 1 },
            lastUpdated: new Date(),
          },
          create: {
            bloodBankId: donation.bloodBankId,
            bloodGroup: donation.bloodGroup,
            quantity: 1,
            minimumQuantity: 10,
            maximumQuantity: 100,
          },
        });

        // Update donor's last donation date
        await tx.user.update({
          where: { id: donation.donorId },
          data: {
            lastDonation: new Date(),
          },
        });
      }

      return updatedDonation;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Donation completed successfully",
    });
  } catch (error) {
    console.error("Error completing donation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete donation" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 5: Find Eligible Donors
// ============================================
// Route: GET /api/donors/eligible?bloodGroup=O_POSITIVE&city=Mumbai

export async function findEligibleDonors(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bloodGroup = searchParams.get("bloodGroup") as BloodGroup | null;
    const city = searchParams.get("city");

    // Calculate date 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const donors = await prisma.user.findMany({
      where: {
        role: "DONOR",
        ...(bloodGroup && { bloodGroup }),
        ...(city && { city }),
        isActive: true,
        isVerified: true,
        OR: [{ lastDonation: null }, { lastDonation: { lt: ninetyDaysAgo } }],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bloodGroup: true,
        city: true,
        state: true,
        lastDonation: true,
      },
      orderBy: {
        lastDonation: "asc", // Donors who haven't donated in longest time first
      },
    });

    return NextResponse.json({
      success: true,
      data: donors,
      count: donors.length,
    });
  } catch (error) {
    console.error("Error finding eligible donors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to find eligible donors" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 6: Get User Dashboard Statistics
// ============================================
// Route: GET /api/users/:id/stats

export async function getUserStats(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get total donations
    const totalDonations = await prisma.donation.count({
      where: {
        donorId: params.id,
        status: DonationStatus.COMPLETED,
      },
    });

    // Get last donation
    const lastDonation = await prisma.donation.findFirst({
      where: {
        donorId: params.id,
        status: DonationStatus.COMPLETED,
      },
      orderBy: {
        donationDate: "desc",
      },
      select: {
        donationDate: true,
      },
    });

    // Get total units contributed
    const totalUnits = await prisma.donation.aggregate({
      where: {
        donorId: params.id,
        status: DonationStatus.COMPLETED,
      },
      _sum: {
        quantity: true,
      },
    });

    // Calculate next eligible date
    let nextEligibleDate = null;
    if (lastDonation?.donationDate) {
      nextEligibleDate = new Date(lastDonation.donationDate);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);
    }

    // Get pending donations
    const pendingDonations = await prisma.donation.count({
      where: {
        donorId: params.id,
        status: DonationStatus.SCHEDULED,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalDonations,
        lastDonationDate: lastDonation?.donationDate,
        nextEligibleDate,
        totalUnitsContributed: totalUnits._sum.quantity || 0,
        livesImpacted: totalDonations * 3, // Estimated: 1 donation can save 3 lives
        pendingDonations,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 7: Approve Blood Request
// ============================================
// Route: POST /api/blood-requests/:id/approve

export async function approveBloodRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { bloodBankId, approvedBy } = body;

    // Get the request
    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id: params.id },
    });

    if (!bloodRequest) {
      return NextResponse.json(
        { success: false, error: "Blood request not found" },
        { status: 404 }
      );
    }

    // Check if blood bank has sufficient inventory
    const inventory = await prisma.bloodInventory.findUnique({
      where: {
        bloodBankId_bloodGroup: {
          bloodBankId,
          bloodGroup: bloodRequest.bloodGroup,
        },
      },
    });

    if (!inventory || inventory.quantity < bloodRequest.quantityNeeded) {
      return NextResponse.json(
        { success: false, error: "Insufficient blood inventory" },
        { status: 400 }
      );
    }

    // Approve the request
    const updatedRequest = await prisma.bloodRequest.update({
      where: { id: params.id },
      data: {
        status: RequestStatus.APPROVED,
        bloodBankId,
        approvedBy,
        approvedAt: new Date(),
      },
      include: {
        requester: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        hospital: true,
        bloodBank: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: "Blood request approved successfully",
    });
  } catch (error) {
    console.error("Error approving blood request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve blood request" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 8: Get Blood Bank Dashboard Stats
// ============================================
// Route: GET /api/blood-banks/:id/dashboard

export async function getBloodBankDashboard(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get inventory summary
    const inventory = await prisma.bloodInventory.findMany({
      where: { bloodBankId: params.id },
    });

    const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockGroups = inventory
      .filter((item) => item.quantity < item.minimumQuantity)
      .map((item) => item.bloodGroup);

    // Get today's donations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysDonations = await prisma.donation.count({
      where: {
        bloodBankId: params.id,
        donationDate: { gte: today },
        status: DonationStatus.COMPLETED,
      },
    });

    // Get pending donations (scheduled)
    const pendingDonations = await prisma.donation.count({
      where: {
        bloodBankId: params.id,
        status: DonationStatus.SCHEDULED,
      },
    });

    // Get pending requests
    const pendingRequests = await prisma.bloodRequest.count({
      where: {
        bloodBankId: params.id,
        status: RequestStatus.PENDING,
      },
    });

    // Get critical requests
    const criticalRequests = await prisma.bloodRequest.count({
      where: {
        bloodBankId: params.id,
        status: RequestStatus.PENDING,
        urgency: "CRITICAL",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUnits,
        bloodGroupDistribution: inventory.reduce((acc, item) => {
          acc[item.bloodGroup] = item.quantity;
          return acc;
        }, {} as Record<BloodGroup, number>),
        lowStockGroups,
        todaysDonations,
        pendingDonations,
        pendingRequests,
        criticalRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching blood bank dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 9: Register New User
// ============================================
// Route: POST /api/auth/register

export async function registerUser(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      bloodGroup,
      dateOfBirth,
      gender,
      city,
      state,
      address,
      pincode,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email or phone already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role || "DONOR",
        bloodGroup,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        city,
        state,
        address,
        pincode,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        bloodGroup: true,
        city: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
