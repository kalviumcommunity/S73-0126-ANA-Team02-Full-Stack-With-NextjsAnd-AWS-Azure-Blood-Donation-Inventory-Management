# Blood Requests API - Testing Guide

## Overview

This guide shows how to test the Blood Requests API endpoints using curl, Postman, or your browser.

## Base URL

```
http://localhost:3000/api/blood-requests
```

## Endpoints Implemented

### 1. GET /api/blood-requests (List All Requests)

**Description:** Retrieve paginated list of blood requests with optional filters

**Method:** `GET`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (PENDING, APPROVED, REJECTED, FULFILLED, CANCELLED)
- `urgency` (optional): Filter by urgency (NORMAL, URGENT, CRITICAL)
- `bloodGroup` (optional): Filter by blood group (A_POSITIVE, B_POSITIVE, etc.)

**Example Requests:**

```bash
# Get all blood requests (first page)
curl http://localhost:3000/api/blood-requests

# Get page 2 with 10 items per page
curl http://localhost:3000/api/blood-requests?page=2&limit=10

# Filter by status
curl http://localhost:3000/api/blood-requests?status=PENDING

# Filter by urgency
curl http://localhost:3000/api/blood-requests?urgency=CRITICAL

# Filter by blood group
curl http://localhost:3000/api/blood-requests?bloodGroup=O_POSITIVE

# Multiple filters
curl "http://localhost:3000/api/blood-requests?status=PENDING&urgency=URGENT&page=1&limit=20"
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc-123",
      "bloodGroup": "O_POSITIVE",
      "quantityNeeded": 2,
      "status": "PENDING",
      "urgency": "URGENT",
      "patientName": "John Doe",
      "patientAge": 45,
      "purpose": "Surgery",
      "requiredBy": "2026-01-20T00:00:00.000Z",
      "createdAt": "2026-01-14T10:30:00.000Z",
      "requester": {
        "id": "user-123",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@hospital.com",
        "phoneNumber": "+91-9876543210"
      },
      "bloodBank": {
        "id": "bank-123",
        "name": "Central Blood Bank",
        "city": "Mumbai",
        "state": "Maharashtra",
        "phoneNumber": "+91-1234567890"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### 2. POST /api/blood-requests (Create Request)

**Description:** Create a new blood request

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**

```json
{
  "requesterId": "user-uuid-here",
  "bloodBankId": "bloodbank-uuid-here",
  "bloodGroup": "O_POSITIVE",
  "quantityNeeded": 2,
  "patientName": "John Doe",
  "patientAge": 45,
  "purpose": "Emergency surgery",
  "requiredBy": "2026-01-20T00:00:00.000Z",
  "urgency": "URGENT",
  "patientGender": "MALE",
  "hospitalName": "City General Hospital",
  "doctorName": "Dr. Sarah Johnson",
  "contactNumber": "+91-9876543210",
  "additionalNotes": "Patient has AB+ blood type history"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/blood-requests \
  -H "Content-Type: application/json" \
  -d '{
    "requesterId": "user-uuid-here",
    "bloodBankId": "bloodbank-uuid-here",
    "bloodGroup": "O_POSITIVE",
    "quantityNeeded": 2,
    "patientName": "John Doe",
    "patientAge": 45,
    "purpose": "Emergency surgery",
    "requiredBy": "2026-01-20T00:00:00.000Z",
    "urgency": "URGENT"
  }'
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Blood request created successfully",
  "data": {
    "id": "new-request-uuid",
    "bloodGroup": "O_POSITIVE",
    "quantityNeeded": 2,
    "status": "PENDING",
    "urgency": "URGENT",
    "patientName": "John Doe",
    "patientAge": 45,
    "purpose": "Emergency surgery",
    "requiredBy": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-01-14T10:30:00.000Z",
    "requester": {
      "id": "user-uuid-here",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@hospital.com"
    },
    "bloodBank": {
      "id": "bloodbank-uuid-here",
      "name": "Central Blood Bank",
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields",
    "details": {
      "missingFields": ["patientName", "patientAge"]
    }
  }
}
```

---

### 3. GET /api/blood-requests/[id] (Get Single Request)

**Description:** Retrieve a specific blood request by ID

**Method:** `GET`

**URL Parameters:**
- `id`: Blood request UUID

**Example Request:**

```bash
curl http://localhost:3000/api/blood-requests/abc-123
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "abc-123",
    "bloodGroup": "O_POSITIVE",
    "quantityNeeded": 2,
    "status": "PENDING",
    "urgency": "URGENT",
    "patientName": "John Doe",
    "patientAge": 45,
    "purpose": "Emergency surgery",
    "requiredBy": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-01-14T10:30:00.000Z",
    "requester": {
      "id": "user-123",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@hospital.com",
      "phoneNumber": "+91-9876543210",
      "role": "HOSPITAL"
    },
    "bloodBank": {
      "id": "bank-123",
      "name": "Central Blood Bank",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phoneNumber": "+91-1234567890",
      "email": "info@centralbloodbank.com",
      "operatingHours": "24/7"
    }
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Blood request not found"
  }
}
```

---

### 4. PUT /api/blood-requests/[id] (Update Request)

**Description:** Update a blood request (partial or full update)

**Method:** `PUT`

**URL Parameters:**
- `id`: Blood request UUID

**Headers:**
```
Content-Type: application/json
```

**Request Body (all fields optional):**

```json
{
  "status": "APPROVED",
  "quantityNeeded": 3,
  "urgency": "CRITICAL",
  "additionalNotes": "Updated: Urgent need confirmed by doctor"
}
```

**Example Request:**

```bash
curl -X PUT http://localhost:3000/api/blood-requests/abc-123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "urgency": "CRITICAL"
  }'
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Blood request updated successfully",
  "data": {
    "id": "abc-123",
    "bloodGroup": "O_POSITIVE",
    "quantityNeeded": 2,
    "status": "APPROVED",
    "urgency": "CRITICAL",
    "patientName": "John Doe",
    "patientAge": 45,
    "purpose": "Emergency surgery",
    "requiredBy": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-01-14T10:30:00.000Z",
    "updatedAt": "2026-01-14T11:00:00.000Z",
    "requester": {
      "id": "user-123",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@hospital.com"
    },
    "bloodBank": {
      "id": "bank-123",
      "name": "Central Blood Bank",
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status value",
    "details": {
      "validStatuses": ["PENDING", "APPROVED", "REJECTED", "FULFILLED", "CANCELLED"]
    }
  }
}
```

---

### 5. DELETE /api/blood-requests/[id] (Delete Request)

**Description:** Delete a blood request

**Method:** `DELETE`

**URL Parameters:**
- `id`: Blood request UUID

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/api/blood-requests/abc-123
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Blood request deleted successfully"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Blood request not found"
  }
}
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import" → "Raw text"
3. Paste the collection JSON below
4. Click "Import"

### Postman Collection

```json
{
  "info": {
    "name": "BloodLink - Blood Requests API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "List Blood Requests",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/blood-requests?page=1&limit=20",
          "host": ["{{baseUrl}}"],
          "path": ["api", "blood-requests"],
          "query": [
            { "key": "page", "value": "1" },
            { "key": "limit", "value": "20" }
          ]
        }
      }
    },
    {
      "name": "Create Blood Request",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"requesterId\": \"{{userId}}\",\n  \"bloodBankId\": \"{{bloodBankId}}\",\n  \"bloodGroup\": \"O_POSITIVE\",\n  \"quantityNeeded\": 2,\n  \"patientName\": \"John Doe\",\n  \"patientAge\": 45,\n  \"purpose\": \"Surgery\",\n  \"requiredBy\": \"2026-01-20T00:00:00.000Z\",\n  \"urgency\": \"URGENT\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/blood-requests",
          "host": ["{{baseUrl}}"],
          "path": ["api", "blood-requests"]
        }
      }
    },
    {
      "name": "Get Blood Request",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/blood-requests/{{requestId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "blood-requests", "{{requestId}}"]
        }
      }
    },
    {
      "name": "Update Blood Request",
      "request": {
        "method": "PUT",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"APPROVED\",\n  \"urgency\": \"CRITICAL\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/blood-requests/{{requestId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "blood-requests", "{{requestId}}"]
        }
      }
    },
    {
      "name": "Delete Blood Request",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/blood-requests/{{requestId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "blood-requests", "{{requestId}}"]
        }
      }
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000" },
    { "key": "userId", "value": "user-uuid-here" },
    { "key": "bloodBankId", "value": "bloodbank-uuid-here" },
    { "key": "requestId", "value": "request-uuid-here" }
  ]
}
```

---

## Getting Test IDs

To get valid UUIDs for testing, run the database connection test:

```bash
npm run test:db
```

This will show existing user, blood bank, and request IDs you can use for testing.

Or query the database directly:

```bash
# Get user IDs
npx prisma studio
# Navigate to User table, copy an ID

# Or use Prisma Client in Node console
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findFirst().then(u => console.log(u.id))"
```

---

## Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Missing or invalid input fields |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `INVALID_REFERENCE` | 400 | Referenced entity (user/blood bank) doesn't exist |
| `INTERNAL_ERROR` | 500 | Server or database error |

---

## Testing Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Ensure Database is Running

```bash
npm run test:db
```

### 3. Test Endpoints in Order

```bash
# 1. List all requests
curl http://localhost:3000/api/blood-requests

# 2. Get IDs from step 1, then get a single request
curl http://localhost:3000/api/blood-requests/<id-from-step-1>

# 3. Create a new request (use valid user/blood bank IDs)
curl -X POST http://localhost:3000/api/blood-requests \
  -H "Content-Type: application/json" \
  -d '{...}'

# 4. Update the request you just created
curl -X PUT http://localhost:3000/api/blood-requests/<new-id> \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}'

# 5. Delete the request (optional)
curl -X DELETE http://localhost:3000/api/blood-requests/<new-id>
```

---

## Next Steps

- Add authentication middleware (JWT verification)
- Implement rate limiting
- Add request validation with Zod
- Create additional action endpoints:
  - `POST /api/blood-requests/:id/approve`
  - `POST /api/blood-requests/:id/fulfill`
  - `POST /api/blood-requests/:id/reject`
- Add integration tests
- Document with Swagger/OpenAPI
