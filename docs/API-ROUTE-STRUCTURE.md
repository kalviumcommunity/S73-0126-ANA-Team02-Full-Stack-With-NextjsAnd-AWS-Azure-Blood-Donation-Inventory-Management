# RESTful API Route Hierarchy - BloodLink Project

## Folder Structure

```
app/
└── api/
    ├── users/
    │   ├── route.ts                      # GET /api/users, POST /api/users
    │   ├── [id]/
    │   │   ├── route.ts                  # GET /api/users/:id, PUT /api/users/:id, DELETE /api/users/:id
    │   │   ├── donations/
    │   │   │   └── route.ts              # GET /api/users/:id/donations
    │   │   └── blood-requests/
    │   │       └── route.ts              # GET /api/users/:id/blood-requests
    │   └── me/
    │       └── route.ts                  # GET /api/users/me (current authenticated user)
    │
    ├── hospitals/
    │   ├── route.ts                      # GET /api/hospitals, POST /api/hospitals
    │   ├── [id]/
    │   │   ├── route.ts                  # GET /api/hospitals/:id, PUT /api/hospitals/:id, DELETE /api/hospitals/:id
    │   │   └── blood-requests/
    │   │       └── route.ts              # GET /api/hospitals/:id/blood-requests
    │   └── search/
    │       └── route.ts                  # GET /api/hospitals/search?city=Mumbai&radius=10
    │
    ├── blood-banks/
    │   ├── route.ts                      # GET /api/blood-banks, POST /api/blood-banks
    │   ├── [id]/
    │   │   ├── route.ts                  # GET /api/blood-banks/:id, PUT /api/blood-banks/:id, DELETE /api/blood-banks/:id
    │   │   ├── inventory/
    │   │   │   └── route.ts              # GET /api/blood-banks/:id/inventory
    │   │   └── donations/
    │   │       └── route.ts              # GET /api/blood-banks/:id/donations
    │   └── nearby/
    │       └── route.ts                  # GET /api/blood-banks/nearby?lat=19.0760&lng=72.8777
    │
    ├── blood-inventory/
    │   ├── route.ts                      # GET /api/blood-inventory, POST /api/blood-inventory
    │   ├── [id]/
    │   │   └── route.ts                  # GET /api/blood-inventory/:id, PUT /api/blood-inventory/:id, DELETE /api/blood-inventory/:id
    │   ├── low-stock/
    │   │   └── route.ts                  # GET /api/blood-inventory/low-stock
    │   └── summary/
    │       └── route.ts                  # GET /api/blood-inventory/summary (aggregated stats)
    │
    ├── blood-requests/
    │   ├── route.ts                      # GET /api/blood-requests, POST /api/blood-requests
    │   ├── [id]/
    │   │   ├── route.ts                  # GET /api/blood-requests/:id, PUT /api/blood-requests/:id, DELETE /api/blood-requests/:id
    │   │   ├── approve/
    │   │   │   └── route.ts              # POST /api/blood-requests/:id/approve
    │   │   ├── fulfill/
    │   │   │   └── route.ts              # POST /api/blood-requests/:id/fulfill
    │   │   └── reject/
    │   │       └── route.ts              # POST /api/blood-requests/:id/reject
    │   ├── pending/
    │   │   └── route.ts                  # GET /api/blood-requests/pending
    │   └── urgent/
    │       └── route.ts                  # GET /api/blood-requests/urgent
    │
    ├── donations/
    │   ├── route.ts                      # GET /api/donations, POST /api/donations
    │   ├── [id]/
    │   │   ├── route.ts                  # GET /api/donations/:id, PUT /api/donations/:id, DELETE /api/donations/:id
    │   │   └── complete/
    │   │       └── route.ts              # POST /api/donations/:id/complete
    │   ├── upcoming/
    │   │   └── route.ts                  # GET /api/donations/upcoming
    │   └── history/
    │       └── route.ts                  # GET /api/donations/history?userId=xxx
    │
    ├── campaigns/
    │   ├── route.ts                      # GET /api/campaigns, POST /api/campaigns
    │   ├── [id]/
    │   │   └── route.ts                  # GET /api/campaigns/:id, PUT /api/campaigns/:id, DELETE /api/campaigns/:id
    │   └── active/
    │       └── route.ts                  # GET /api/campaigns/active
    │
    ├── notifications/
    │   ├── route.ts                      # GET /api/notifications, POST /api/notifications
    │   ├── [id]/
    │   │   ├── route.ts                  # GET /api/notifications/:id, DELETE /api/notifications/:id
    │   │   └── read/
    │   │       └── route.ts              # POST /api/notifications/:id/read
    │   └── unread/
    │       └── route.ts                  # GET /api/notifications/unread
    │
    └── auth/
        ├── register/
        │   └── route.ts                  # POST /api/auth/register
        ├── login/
        │   └── route.ts                  # POST /api/auth/login
        ├── logout/
        │   └── route.ts                  # POST /api/auth/logout
        └── refresh/
            └── route.ts                  # POST /api/auth/refresh
```

## REST Conventions Applied

### HTTP Methods

| Method | Operation | Example | Description |
|--------|-----------|---------|-------------|
| GET | Read | `GET /api/users` | Retrieve collection |
| GET | Read | `GET /api/users/:id` | Retrieve single resource |
| POST | Create | `POST /api/users` | Create new resource |
| PUT | Update | `PUT /api/users/:id` | Full update (replace) |
| PATCH | Update | `PATCH /api/users/:id` | Partial update (modify) |
| DELETE | Delete | `DELETE /api/users/:id` | Remove resource |

### Naming Conventions

✅ **Plural nouns:** `/api/users` (not `/api/user`)  
✅ **Lowercase:** `/api/blood-inventory` (not `/api/BloodInventory`)  
✅ **Hyphens for multi-word:** `/api/blood-requests` (not `/api/blood_requests` or `/api/bloodRequests`)  
✅ **No verbs in resource names:** `/api/users/:id/donations` (not `/api/users/:id/getDonations`)  
✅ **Actions as nested routes:** `/api/blood-requests/:id/approve` (for non-CRUD operations)

### URL Structure

```
/api/{resource}                          # Collection endpoint
/api/{resource}/{id}                     # Single resource endpoint
/api/{resource}/{id}/{sub-resource}      # Nested resource
/api/{resource}/{id}/{action}            # Resource action (approve, complete, etc.)
/api/{resource}/{filter}                 # Filtered collection (pending, urgent, etc.)
```

## API Endpoint Examples

### Users

```typescript
// Collection
GET    /api/users                        # List all users (paginated)
POST   /api/users                        # Create new user

// Single Resource
GET    /api/users/abc-123                # Get user by ID
PUT    /api/users/abc-123                # Update user (full)
PATCH  /api/users/abc-123                # Update user (partial)
DELETE /api/users/abc-123                # Delete user

// Nested Resources
GET    /api/users/abc-123/donations      # Get user's donations
GET    /api/users/abc-123/blood-requests # Get user's blood requests

// Special Routes
GET    /api/users/me                     # Get current authenticated user
```

### Blood Inventory

```typescript
// Collection
GET    /api/blood-inventory              # List all inventory
POST   /api/blood-inventory              # Create inventory record

// Single Resource
GET    /api/blood-inventory/abc-123     # Get inventory by ID
PUT    /api/blood-inventory/abc-123     # Update inventory
DELETE /api/blood-inventory/abc-123     # Delete inventory

// Filtered Collections
GET    /api/blood-inventory/low-stock   # Get low stock items
GET    /api/blood-inventory/summary     # Get aggregated statistics
```

### Blood Requests

```typescript
// Collection
GET    /api/blood-requests               # List all requests
POST   /api/blood-requests               # Create new request

// Single Resource
GET    /api/blood-requests/abc-123      # Get request by ID
PUT    /api/blood-requests/abc-123      # Update request
DELETE /api/blood-requests/abc-123      # Delete request

// Actions (State Transitions)
POST   /api/blood-requests/abc-123/approve  # Approve request
POST   /api/blood-requests/abc-123/fulfill  # Mark as fulfilled
POST   /api/blood-requests/abc-123/reject   # Reject request

// Filtered Collections
GET    /api/blood-requests/pending      # Get pending requests
GET    /api/blood-requests/urgent       # Get urgent requests
```

### Donations

```typescript
// Collection
GET    /api/donations                    # List all donations
POST   /api/donations                    # Schedule donation

// Single Resource
GET    /api/donations/abc-123            # Get donation by ID
PUT    /api/donations/abc-123            # Update donation
DELETE /api/donations/abc-123            # Cancel donation

// Actions
POST   /api/donations/abc-123/complete  # Mark donation complete

// Filtered Collections
GET    /api/donations/upcoming           # Get upcoming donations
GET    /api/donations/history?userId=xxx # Get donation history
```

## Query Parameters

### Pagination

```typescript
GET /api/users?page=1&limit=20
GET /api/blood-requests?page=2&limit=50
```

### Filtering

```typescript
GET /api/users?role=DONOR
GET /api/blood-inventory?bloodGroup=O_POSITIVE
GET /api/blood-requests?status=PENDING&urgency=CRITICAL
```

### Sorting

```typescript
GET /api/donations?sortBy=donationDate&order=desc
GET /api/blood-requests?sortBy=createdAt&order=asc
```

### Search

```typescript
GET /api/users?search=john
GET /api/hospitals?search=mumbai
```

### Multiple Filters

```typescript
GET /api/users?role=DONOR&city=Mumbai&bloodGroup=O_POSITIVE&page=1&limit=20
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### Collection Response (200 OK)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Created Response (201 Created)

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Error Response (400/404/500)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

## Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Semantic validation error |
| 500 | Internal Server Error | Unexpected server error |

## Authentication & Authorization

### Protected Routes

Most routes require authentication:

```typescript
Authorization: Bearer <JWT_TOKEN>
```

### Public Routes

```typescript
POST /api/auth/register      # Public - user registration
POST /api/auth/login         # Public - user login
GET  /api/campaigns          # Public - view campaigns
GET  /api/blood-inventory    # Public - view availability
```

### Role-Based Access Control (RBAC)

```typescript
// Admin only
POST   /api/users                    # Create user (admin verification)
DELETE /api/users/:id                # Delete user

// Blood Bank Staff
POST   /api/blood-inventory          # Create inventory
PUT    /api/blood-inventory/:id      # Update inventory
POST   /api/blood-requests/:id/approve   # Approve request

// Donors
POST   /api/donations                # Schedule donation
GET    /api/users/me                 # View own profile

// Hospitals
POST   /api/blood-requests           # Create request
GET    /api/hospitals/:id/blood-requests  # View hospital requests
```

## Implementation Example

### User Collection Route (app/api/users/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const user = await authenticate(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    // Build query
    const skip = (page - 1) * limit;
    const where: any = {};

    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Execute query
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          bloodGroup: true,
          city: true,
          // password excluded for security
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch users" } },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation (use Zod in production)
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: await hashPassword(body.password),
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role || "DONOR",
        bloodGroup: body.bloodGroup,
        phoneNumber: body.phoneNumber,
        city: body.city,
        state: body.state,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint violation
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_EMAIL", message: "Email already exists" } },
        { status: 409 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to create user" } },
      { status: 500 }
    );
  }
}
```

### Single User Route (app/api/users/[id]/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bloodGroup: true,
        phoneNumber: true,
        city: true,
        state: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch user" } },
      { status: 500 }
    );
  }
}

// PUT /api/users/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        city: body.city,
        state: body.state,
        bloodGroup: body.bloodGroup,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update user" } },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 204 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to delete user" } },
      { status: 500 }
    );
  }
}
```

## Key Design Decisions

### 1. File-Based Routing
Using Next.js App Router conventions for automatic route registration.

### 2. RESTful Resource Naming
Plural nouns (`/api/users`) instead of verbs (`/api/getUsers`).

### 3. Nested Resources
For strong relationships: `/api/users/:id/donations` instead of `/api/donations?userId=:id`.

### 4. Action Routes
For non-CRUD operations: `/api/blood-requests/:id/approve` instead of `PUT /api/blood-requests/:id` with status change.

### 5. Consistent Response Format
All responses follow `{ success, data, error, pagination }` structure.

### 6. Query Parameters
For filtering, sorting, pagination instead of different endpoints.

### 7. HTTP Status Codes
Proper semantic status codes for different scenarios.

### 8. Authentication Middleware
Centralized authentication logic reused across routes.

## Benefits of This Structure

✅ **Predictable:** Developers can guess endpoint URLs  
✅ **Scalable:** Easy to add new resources  
✅ **Maintainable:** Clear separation of concerns  
✅ **Type-Safe:** TypeScript support throughout  
✅ **RESTful:** Industry standard conventions  
✅ **Flexible:** Supports filtering, pagination, nested resources  
✅ **Secure:** Authentication/authorization built-in  

## Next Steps

1. Create folder structure: `mkdir -p app/api/{resource}/[id]`
2. Implement route handlers in `route.ts` files
3. Add authentication middleware
4. Implement validation with Zod schemas
5. Add API documentation (Swagger/OpenAPI)
6. Write integration tests for each endpoint
7. Add rate limiting for production
8. Set up API monitoring and logging
