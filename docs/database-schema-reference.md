# Database Schema Quick Reference

## 📋 Table Summary

| Entity | Purpose | Key Relationships |
|--------|---------|-------------------|
| **User** | All system users | → Donation, BloodRequest, BloodBank, Hospital |
| **BloodBank** | Blood bank locations | → BloodInventory, Donation, BloodRequest |
| **Hospital** | Hospital facilities | → BloodRequest |
| **BloodInventory** | Blood stock levels | → BloodBank |
| **BloodRequest** | Blood requests | → User, Hospital, BloodBank |
| **Donation** | Donation records | → User, BloodBank |
| **Campaign** | Blood drives | Standalone |
| **Notification** | User notifications | Standalone |
| **AuditLog** | System audit trail | Standalone |

## 🔑 Primary Entities

### User
```typescript
{
  id: UUID (PK)
  email: String (UNIQUE)
  phone: String (UNIQUE)
  role: Enum (DONOR, HOSPITAL, BLOOD_BANK, NGO, ADMIN)
  bloodGroup: Enum (A+, A-, B+, B-, AB+, AB-, O+, O-)
  city: String (INDEXED)
  // ... 20+ fields
}
```

**Indexes:**
- `email`, `phone`, `bloodGroup`, `city`, `role`

**Relationships:**
- 1 User → Many Donations
- 1 User → Many BloodRequests
- 1 User ← 1 BloodBank (manager)
- 1 User ← 1 Hospital (contact)

---

### BloodBank
```typescript
{
  id: UUID (PK)
  name: String
  registrationNo: String (UNIQUE)
  email: String (UNIQUE)
  phone: String (UNIQUE)
  city: String (INDEXED)
  latitude: Float
  longitude: Float
  managerId: UUID (FK → User)
  // ... 15+ fields
}
```

**Indexes:**
- `city`, `state`, `pincode`, `isActive`

**Relationships:**
- 1 BloodBank → Many BloodInventory
- 1 BloodBank → Many Donations
- 1 BloodBank → Many BloodRequests
- 1 BloodBank → 1 User (manager)

---

### BloodInventory
```typescript
{
  id: UUID (PK)
  bloodBankId: UUID (FK → BloodBank)
  bloodGroup: Enum (INDEXED)
  quantity: Int (INDEXED)
  minimumQuantity: Int
  maximumQuantity: Int
  expiryDate: DateTime
}
```

**Unique Constraint:**
- `(bloodBankId, bloodGroup)` - One record per blood group per bank

**Indexes:**
- `bloodGroup`, `bloodBankId`, `quantity`

**Relationships:**
- 1 BloodInventory → 1 BloodBank

---

### BloodRequest
```typescript
{
  id: UUID (PK)
  requesterId: UUID (FK → User, CASCADE)
  hospitalId: UUID (FK → Hospital, SET NULL)
  bloodBankId: UUID (FK → BloodBank, SET NULL)
  bloodGroup: Enum (INDEXED)
  quantityNeeded: Int
  status: Enum (PENDING, APPROVED, FULFILLED, REJECTED)
  urgency: String (INDEXED)
  requiredBy: DateTime (INDEXED)
  // ... 15+ fields
}
```

**Indexes:**
- `requesterId`, `hospitalId`, `bloodBankId`
- `bloodGroup`, `status`, `urgency`, `requiredBy`, `createdAt`

**Relationships:**
- 1 BloodRequest → 1 User (requester)
- 1 BloodRequest → 1 Hospital (optional)
- 1 BloodRequest → 1 BloodBank (optional)

---

### Donation
```typescript
{
  id: UUID (PK)
  donorId: UUID (FK → User, CASCADE)
  bloodBankId: UUID (FK → BloodBank, CASCADE)
  bloodGroup: Enum (INDEXED)
  quantity: Float
  donationDate: DateTime (INDEXED)
  scheduledDate: DateTime (INDEXED)
  status: Enum (SCHEDULED, COMPLETED, CANCELLED)
  unitSerialNumber: String (UNIQUE, INDEXED)
  hemoglobinLevel: Float
  bloodPressure: String
  // ... 15+ fields
}
```

**Indexes:**
- `donorId`, `bloodBankId`
- `bloodGroup`, `status`, `donationDate`, `scheduledDate`
- `unitSerialNumber`

**Relationships:**
- 1 Donation → 1 User (donor)
- 1 Donation → 1 BloodBank

---

### Hospital
```typescript
{
  id: UUID (PK)
  name: String
  registrationNo: String (UNIQUE)
  email: String (UNIQUE)
  phone: String (UNIQUE)
  city: String (INDEXED)
  totalBeds: Int
  hasBloodBank: Boolean
  contactPersonId: UUID (FK → User)
  // ... 15+ fields
}
```

**Indexes:**
- `city`, `state`, `pincode`, `isActive`

**Relationships:**
- 1 Hospital → Many BloodRequests
- 1 Hospital → 1 User (contact person)

---

## 🔗 Cascade Rules

### ON DELETE CASCADE
When parent is deleted, children are automatically deleted:
- User → Donations (delete user = delete their donations)
- User → BloodRequests (delete user = delete their requests)
- BloodBank → BloodInventory (delete bank = delete inventory)
- BloodBank → Donations (delete bank = delete donations there)

### ON DELETE SET NULL
When parent is deleted, foreign key is set to NULL:
- User → BloodBank.managerId
- User → Hospital.contactPersonId
- Hospital → BloodRequest.hospitalId
- BloodBank → BloodRequest.bloodBankId

---

## 🎯 Common Query Patterns

### Find Available Blood in City
```typescript
const inventory = await prisma.bloodInventory.findMany({
  where: {
    bloodGroup: 'O_POSITIVE',
    quantity: { gt: 0 },
    bloodBank: {
      city: 'Mumbai',
      isActive: true,
    },
  },
  include: { bloodBank: true },
});
```

### Get Eligible Donors
```typescript
const donors = await prisma.user.findMany({
  where: {
    role: 'DONOR',
    bloodGroup: 'A_POSITIVE',
    isActive: true,
    isVerified: true,
    city: 'Mumbai',
    lastDonation: {
      lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    },
  },
});
```

### Create Blood Request
```typescript
const request = await prisma.bloodRequest.create({
  data: {
    requesterId: userId,
    hospitalId: hospitalId,
    bloodGroup: 'B_POSITIVE',
    quantityNeeded: 2,
    urgency: 'CRITICAL',
    patientName: 'John Doe',
    requiredBy: new Date('2025-01-20'),
    purpose: 'Emergency surgery',
  },
});
```

### Update Inventory After Donation
```typescript
await prisma.bloodInventory.update({
  where: {
    bloodBankId_bloodGroup: {
      bloodBankId: bloodBankId,
      bloodGroup: 'O_POSITIVE',
    },
  },
  data: {
    quantity: { increment: 1 },
    lastUpdated: new Date(),
  },
});
```

---

## 📊 Enums Reference

### UserRole
- `DONOR` - Blood donor
- `HOSPITAL` - Hospital staff
- `BLOOD_BANK` - Blood bank staff
- `NGO` - NGO staff
- `ADMIN` - System administrator

### BloodGroup
- `A_POSITIVE`, `A_NEGATIVE`
- `B_POSITIVE`, `B_NEGATIVE`
- `AB_POSITIVE`, `AB_NEGATIVE`
- `O_POSITIVE`, `O_NEGATIVE`

### RequestStatus
- `PENDING` - Submitted
- `APPROVED` - Approved by blood bank
- `FULFILLED` - Blood delivered
- `REJECTED` - Request rejected
- `CANCELLED` - Cancelled by requester

### DonationStatus
- `SCHEDULED` - Appointment scheduled
- `COMPLETED` - Donation done
- `CANCELLED` - Cancelled
- `NO_SHOW` - Donor didn't show

### Gender
- `MALE`, `FEMALE`, `OTHER`

---

## 🛡️ Constraints Summary

### Unique Constraints
- User: `email`, `phone`
- BloodBank: `registrationNo`, `email`, `phone`, `managerId`
- Hospital: `registrationNo`, `email`, `phone`, `contactPersonId`
- Donation: `unitSerialNumber`
- BloodInventory: `(bloodBankId, bloodGroup)` composite

### Required Fields (NOT NULL)
- All IDs, email, password, role
- Names, phone numbers
- Addresses (street, city, state)
- Blood group (where applicable)
- Status fields
- Timestamps (createdAt, updatedAt)

### Default Values
- User.role: `DONOR`
- User.isActive: `true`
- User.country: `"India"`
- BloodInventory.quantity: `0`
- Request.status: `PENDING`
- Donation.status: `SCHEDULED`

---

## 💡 Best Practices

### 1. Always Use Transactions for Related Updates
```typescript
await prisma.$transaction([
  prisma.donation.update({ ... }),
  prisma.bloodInventory.update({ ... }),
]);
```

### 2. Use Select to Reduce Payload
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
  },
});
```

### 3. Leverage Indexes for Performance
- Always filter on indexed fields
- Use composite indexes for multi-field queries
- Avoid SELECT * in production

### 4. Handle Cascading Deletes Carefully
```typescript
// This will delete all user's donations and requests!
await prisma.user.delete({ where: { id: userId } });

// Better: Soft delete
await prisma.user.update({
  where: { id: userId },
  data: { isActive: false },
});
```

---

## 🔍 Useful Prisma Commands

```bash
# Format schema
npx prisma format

# Validate schema
npx prisma validate

# View DB in browser
npx prisma studio

# Generate types
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes data!)
npx prisma migrate reset

# Seed database
npm run prisma:seed
```

---

## 📈 Performance Tips

1. **Use indexes wisely**: Already configured for common queries
2. **Batch operations**: Use `createMany`, `updateMany`
3. **Connection pooling**: Configured in Prisma client
4. **Pagination**: Always use `take` and `skip`
5. **Eager loading**: Use `include` judiciously
6. **Caching**: Consider Redis for frequently accessed data

---

## 🔐 Security Checklist

- ✅ Passwords are hashed (bcrypt)
- ✅ UUIDs prevent enumeration attacks
- ✅ Cascade rules prevent orphaned records
- ✅ Unique constraints prevent duplicates
- ✅ Indexes improve query performance
- ✅ Timestamps track record changes
- ✅ Role-based access control (via UserRole)
- ✅ Soft delete option (isActive field)
- ✅ Audit logging available (AuditLog table)
