# Database Entity-Relationship Diagram

## Overview
This document provides a visual representation of the Blood Donation & Inventory Management database schema.

## Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER (Central Entity)                            │
├─────────────────────────────────────────────────────────────────────────┤
│ • id (PK, UUID)                                                          │
│ • email (UNIQUE, INDEXED)                                                │
│ • password (hashed)                                                      │
│ • role (ENUM: DONOR, HOSPITAL, BLOOD_BANK, NGO, ADMIN) (INDEXED)       │
│ • firstName, lastName, phone (UNIQUE, INDEXED)                          │
│ • dateOfBirth, gender, bloodGroup (INDEXED)                             │
│ • address, city (INDEXED), state, pincode, country                      │
│ • weight, lastDonation, medicalNotes                                     │
│ • isActive, isVerified, emailVerified, phoneVerified                     │
│ • createdAt, updatedAt                                                   │
└─────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
         │ (1:N)              │ (1:N)              │ (1:1)
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   DONATION      │  │  BLOOD_REQUEST  │  │   BLOOD_BANK    │
├─────────────────┤  ├─────────────────┤  │    (optional)   │
│ • id (PK)       │  │ • id (PK)       │  ├─────────────────┤
│ • donorId (FK)  │  │ • requesterId   │  │ • managerId (FK)│
│   → User        │  │   (FK) → User   │  │   → User        │
│ • bloodBankId   │  │ • hospitalId    │  └─────────────────┘
│   (FK)          │  │   (FK)          │           │
│ • bloodGroup    │  │ • bloodBankId   │           │
│   (INDEXED)     │  │   (FK)          │           │ (1:1)
│ • quantity      │  │ • bloodGroup    │           │
│ • donationDate  │  │   (INDEXED)     │           ▼
│   (INDEXED)     │  │ • quantityNeeded│  ┌─────────────────┐
│ • scheduledDate │  │ • urgency       │  │    HOSPITAL     │
│   (INDEXED)     │  │   (INDEXED)     │  │    (optional)   │
│ • status        │  │ • patientName   │  ├─────────────────┤
│   (INDEXED)     │  │ • patientAge    │  │ • contactPersonId│
│ • hemoglobinLevel│ │ • requiredBy    │  │   (FK) → User   │
│ • bloodPressure │  │   (INDEXED)     │  └─────────────────┘
│ • weight        │  │ • status        │
│ • temperature   │  │   (INDEXED)     │
│ • isEligible    │  │ • purpose       │
│ • unitSerialNo  │  │ • medicalNotes  │
│   (UNIQUE)      │  │ • doctorName    │
│ • expiryDate    │  │ • doctorContact │
│ • collectedBy   │  │ • approvedBy    │
│ • createdAt     │  │ • approvedAt    │
│ • updatedAt     │  │ • fulfilledAt   │
└─────────────────┘  │ • cancelledAt   │
                     │ • rejectionReason│
                     │ • createdAt     │
                     │ • updatedAt     │
                     └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           BLOOD_BANK                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ • id (PK, UUID)                                                          │
│ • name, registrationNo (UNIQUE)                                          │
│ • email (UNIQUE), phone (UNIQUE), alternatePhone                         │
│ • address, city (INDEXED), state, pincode (INDEXED), country            │
│ • latitude, longitude (for location search)                              │
│ • operatingHours                                                          │
│ • isActive (INDEXED), isVerified                                         │
│ • managerId (FK → User, SET NULL)                                        │
│ • createdAt, updatedAt                                                   │
└─────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ (1:N)              │ (1:N)              │ (1:N)
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ BLOOD_INVENTORY │  │   DONATION      │  │  BLOOD_REQUEST  │
├─────────────────┤  │  (see above)    │  │  (see above)    │
│ • id (PK)       │  └─────────────────┘  └─────────────────┘
│ • bloodBankId   │
│   (FK, CASCADE) │
│ • bloodGroup    │
│   (INDEXED)     │
│ • quantity      │
│   (INDEXED)     │
│ • lastUpdated   │
│ • expiryDate    │
│ • minimumQty    │
│ • maximumQty    │
│ • createdAt     │
│ • updatedAt     │
│                 │
│ UNIQUE:         │
│ (bloodBankId,   │
│  bloodGroup)    │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                            HOSPITAL                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ • id (PK, UUID)                                                          │
│ • name, registrationNo (UNIQUE)                                          │
│ • email (UNIQUE), phone (UNIQUE), alternatePhone, emergencyPhone        │
│ • address, city (INDEXED), state, pincode (INDEXED), country            │
│ • latitude, longitude                                                     │
│ • totalBeds, hasBloodBank                                                │
│ • isActive (INDEXED), isVerified                                         │
│ • contactPersonId (FK → User, SET NULL)                                  │
│ • createdAt, updatedAt                                                   │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ (1:N)
         ▼
┌─────────────────┐
│  BLOOD_REQUEST  │
│  (see above)    │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       AUXILIARY ENTITIES                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   AUDIT_LOG     │  │  NOTIFICATION   │  │    CAMPAIGN     │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • id (PK)       │  │ • id (PK)       │  │ • id (PK)       │
│ • entityType    │  │ • userId        │  │ • name          │
│ • entityId      │  │ • title         │  │ • description   │
│ • action        │  │ • message       │  │ • startDate     │
│ • changes (JSON)│  │ • type          │  │ • endDate       │
│ • performedBy   │  │ • isRead        │  │ • location      │
│ • ipAddress     │  │ • link          │  │ • city          │
│ • userAgent     │  │ • createdAt     │  │ • organizer     │
│ • timestamp     │  └─────────────────┘  │ • contactPerson │
└─────────────────┘                       │ • contactPhone  │
                                          │ • isActive      │
                                          │ • targetUnits   │
                                          │ • collectedUnits│
                                          │ • createdAt     │
                                          │ • updatedAt     │
                                          └─────────────────┘
```

## Relationship Types

### One-to-Many (1:N)
- **User → Donations**: One user can make many donations
- **User → BloodRequests**: One user can create many blood requests
- **BloodBank → BloodInventory**: One blood bank has multiple inventory records (one per blood group)
- **BloodBank → Donations**: One blood bank receives many donations
- **BloodBank → BloodRequests**: One blood bank handles many requests
- **Hospital → BloodRequests**: One hospital makes many requests

### One-to-One (1:1)
- **User ← BloodBank**: One blood bank has one manager (optional)
- **User ← Hospital**: One hospital has one contact person (optional)

### Many-to-One (N:1) / Foreign Keys
- **Donation → User**: Many donations from one user (donorId)
- **Donation → BloodBank**: Many donations to one blood bank (bloodBankId)
- **BloodRequest → User**: Many requests from one user (requesterId)
- **BloodRequest → Hospital**: Many requests from one hospital (hospitalId)
- **BloodRequest → BloodBank**: Many requests to one blood bank (bloodBankId)
- **BloodInventory → BloodBank**: Many inventory records per blood bank (bloodBankId)

## Cascade Behavior

### ON DELETE CASCADE
When parent is deleted, children are automatically deleted:
```
User (deleted) → Donations (CASCADE)
User (deleted) → BloodRequests (CASCADE)
BloodBank (deleted) → BloodInventory (CASCADE)
BloodBank (deleted) → Donations (CASCADE)
```

### ON DELETE SET NULL
When parent is deleted, foreign key is set to NULL:
```
User (deleted) → BloodBank.managerId (SET NULL)
User (deleted) → Hospital.contactPersonId (SET NULL)
Hospital (deleted) → BloodRequest.hospitalId (SET NULL)
BloodBank (deleted) → BloodRequest.bloodBankId (SET NULL)
```

## Unique Constraints

### Single Column Unique
- User: `email`, `phone`
- BloodBank: `registrationNo`, `email`, `phone`
- Hospital: `registrationNo`, `email`, `phone`
- Donation: `unitSerialNumber`

### Composite Unique
- BloodInventory: `(bloodBankId, bloodGroup)` - One record per blood group per blood bank

### Optional Unique (1:1 Relationships)
- BloodBank: `managerId` (only one blood bank per manager)
- Hospital: `contactPersonId` (only one hospital per contact)

## Indexes Summary

### High-Priority Indexes (Frequent Queries)
```sql
-- User Table
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_phone ON users(phone);
CREATE INDEX idx_user_blood_group ON users(blood_group);
CREATE INDEX idx_user_city ON users(city);
CREATE INDEX idx_user_role ON users(role);

-- BloodBank Table
CREATE INDEX idx_blood_bank_city ON blood_banks(city);
CREATE INDEX idx_blood_bank_state ON blood_banks(state);
CREATE INDEX idx_blood_bank_pincode ON blood_banks(pincode);
CREATE INDEX idx_blood_bank_is_active ON blood_banks(is_active);

-- BloodInventory Table
CREATE INDEX idx_inventory_blood_group ON blood_inventory(blood_group);
CREATE INDEX idx_inventory_blood_bank_id ON blood_inventory(blood_bank_id);
CREATE INDEX idx_inventory_quantity ON blood_inventory(quantity);

-- BloodRequest Table
CREATE INDEX idx_request_requester_id ON blood_requests(requester_id);
CREATE INDEX idx_request_hospital_id ON blood_requests(hospital_id);
CREATE INDEX idx_request_blood_bank_id ON blood_requests(blood_bank_id);
CREATE INDEX idx_request_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_request_status ON blood_requests(status);
CREATE INDEX idx_request_urgency ON blood_requests(urgency);
CREATE INDEX idx_request_required_by ON blood_requests(required_by);
CREATE INDEX idx_request_created_at ON blood_requests(created_at);

-- Donation Table
CREATE INDEX idx_donation_donor_id ON donations(donor_id);
CREATE INDEX idx_donation_blood_bank_id ON donations(blood_bank_id);
CREATE INDEX idx_donation_blood_group ON donations(blood_group);
CREATE INDEX idx_donation_status ON donations(status);
CREATE INDEX idx_donation_date ON donations(donation_date);
CREATE INDEX idx_donation_scheduled_date ON donations(scheduled_date);
CREATE INDEX idx_donation_unit_serial ON donations(unit_serial_number);
```

## Data Flow Examples

### Donation Workflow
```
1. Donor (User) schedules donation
   ↓
2. Donation record created (status: SCHEDULED)
   ↓
3. Donor visits BloodBank
   ↓
4. Health check performed (hemoglobin, BP, etc.)
   ↓
5. Donation record updated (status: COMPLETED)
   ↓
6. BloodInventory updated (quantity +1)
```

### Blood Request Workflow
```
1. Hospital creates BloodRequest (status: PENDING)
   ↓
2. BloodBank reviews request
   ↓
3. Request approved (status: APPROVED)
   ↓
4. Blood prepared and delivered
   ↓
5. Request updated (status: FULFILLED)
   ↓
6. BloodInventory updated (quantity -n)
```

## Business Rules Enforced by Schema

1. **No Duplicate Emails/Phones**: UNIQUE constraints prevent duplicate accounts
2. **Blood Group Integrity**: ENUM ensures only valid blood groups
3. **Role-Based Access**: UserRole ENUM defines system access levels
4. **Inventory Consistency**: Composite unique constraint ensures one inventory per blood group per bank
5. **Audit Trail**: Timestamps (createdAt, updatedAt) track all changes
6. **Data Integrity**: Foreign keys with CASCADE/SET NULL maintain referential integrity
7. **Soft Delete**: isActive field allows soft deletion without losing data
8. **Verification**: isVerified fields ensure only validated entities are active
