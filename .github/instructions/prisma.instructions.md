---
applyTo: '**/*'
---
# Prisma ORM Instructions

## Core Principles
- Use Prisma as the sole database access layer; avoid raw SQL queries unless absolutely necessary.
- Leverage Prisma's type safety to catch errors at compile time.
- Use Prisma migrations for all schema changes; never modify the database manually.
- Follow Prisma best practices for query optimization and performance.
- Use transactions for operations that modify multiple tables.
- Implement proper error handling for database operations.
- Use Prisma's connection pooling in production environments.
- Keep the Prisma schema organized and well-documented.

## Schema Design
- Define all models in `prisma/schema.prisma`.
- Use clear, descriptive model and field names (PascalCase for models, camelCase for fields).
- Add `@map` and `@@map` directives to map to different database names if needed.
- Document complex models and relationships with triple-slash comments (`///`).
- Use appropriate field types: `String`, `Int`, `Boolean`, `DateTime`, `Json`, `Decimal`, etc.
- Define proper relationships with `@relation` directive.
- Use `@default` for default values (e.g., `@default(now())`, `@default(uuid())`).
- Add indexes with `@@index` for frequently queried fields.
- Use `@@unique` for unique constraints and `@@id` for composite primary keys.
- Set up cascading deletes/updates appropriately with `onDelete` and `onUpdate`.

```prisma
// Good: Well-documented model with proper relationships
/// Represents a visa application submitted by a user
model Application {
  id          String   @id @default(uuid())
  userId      String
  status      ApplicationStatus @default(DRAFT)
  submittedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  documents   Document[]
  payments    Payment[]

  @@index([userId])
  @@index([status])
  @@index([submittedAt])
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
}
```

## Migrations
- Generate migrations using `prisma migrate dev --name descriptive-name` in development.
- Use descriptive migration names that explain the change (e.g., `add-application-status-field`).
- Review generated migration files before applying them.
- Use `prisma migrate deploy` in production environments.
- Never edit migration files manually after they've been applied.
- Use `prisma migrate reset` only in development to reset the database.
- Keep migration history clean and linear; avoid conflicts.

```bash
# Development: Create and apply migration
npx prisma migrate dev --name add-document-model

# Production: Deploy pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (development only!)
npx prisma migrate reset
```

## Client Usage
- Import Prisma Client from the centralized db instance: `import { db } from "~/server/db"`.
- Never create multiple Prisma Client instances; use the singleton pattern.
- Use async/await for all database operations.
- Handle errors appropriately with try/catch or .catch().
- Use TypeScript's type inference from Prisma Client for type safety.

```typescript
// Good: Using centralized db instance
import { db } from "~/server/db";

export async function getApplicationById(id: string) {
  try {
    const application = await db.application.findUnique({
      where: { id },
      include: {
        user: true,
        documents: true,
        payments: true,
      },
    });
    return application;
  } catch (error) {
    console.error("Failed to fetch application:", error);
    throw new Error("Unable to retrieve application");
  }
}

// Bad: Creating new Prisma Client instance
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // ❌ Don't do this
```

## Query Optimization
- Use `select` to retrieve only needed fields instead of fetching entire models.
- Use `include` to load related data (avoid N+1 queries).
- Use `findUnique` for single record lookups by unique field.
- Use `findMany` with appropriate `where` filters for multiple records.
- Use `take` and `skip` for pagination.
- Use `orderBy` for sorting results.
- Use `cursor`-based pagination for large datasets.
- Use `distinct` to get unique values.
- Leverage database indexes for frequently queried fields.

```typescript
// Good: Optimized query with select and include
const application = await db.application.findUnique({
  where: { id },
  select: {
    id: true,
    status: true,
    submittedAt: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    documents: {
      select: {
        id: true,
        type: true,
        uploadedAt: true,
      },
      orderBy: { uploadedAt: "desc" },
    },
  },
});

// Good: Pagination with cursor
const applications = await db.application.findMany({
  where: { userId },
  take: 20,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: "desc" },
});

// Bad: Fetching all fields when only a few are needed
const application = await db.application.findUnique({
  where: { id },
  include: {
    user: true, // Fetches all user fields
    documents: true, // Fetches all document fields
  },
}); // ❌ Inefficient if you only need specific fields
```

## Transactions
- Use transactions for operations that must succeed or fail together.
- Use `db.$transaction([...])` for multiple independent operations.
- Use `db.$transaction(async (tx) => {...})` for dependent operations.
- Keep transactions short and focused to minimize lock time.
- Handle transaction errors appropriately.

```typescript
// Good: Transaction for dependent operations
async function submitApplication(userId: string, applicationId: string) {
  return await db.$transaction(async (tx) => {
    // Update application status
    const application = await tx.application.update({
      where: { id: applicationId, userId },
      data: { status: "SUBMITTED", submittedAt: new Date() },
    });

    // Create audit log entry
    await tx.auditLog.create({
      data: {
        userId,
        action: "APPLICATION_SUBMITTED",
        resourceId: applicationId,
        timestamp: new Date(),
      },
    });

    // Update user statistics
    await tx.user.update({
      where: { id: userId },
      data: { applicationCount: { increment: 1 } },
    });

    return application;
  });
}

// Good: Transaction for independent operations
async function createApplicationWithDocuments(data: ApplicationData) {
  return await db.$transaction([
    db.application.create({
      data: {
        userId: data.userId,
        status: "DRAFT",
      },
    }),
    db.document.createMany({
      data: data.documents.map((doc) => ({
        applicationId: data.applicationId,
        type: doc.type,
        url: doc.url,
      })),
    }),
  ]);
}
```

## Error Handling
- Catch and handle Prisma errors appropriately.
- Use Prisma error codes to provide meaningful error messages.
- Handle common errors: `P2002` (unique constraint), `P2025` (record not found), etc.
- Log errors for debugging and monitoring.
- Return user-friendly error messages, not raw Prisma errors.

```typescript
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

async function createUser(data: { email: string; name: string }) {
  try {
    return await db.user.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
      }
      // Record not found
      if (error.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested resource was not found",
        });
      }
    }
    // Unknown error
    console.error("Database error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
}
```

## Relations & Nested Operations
- Use `create` with nested data to create related records in one operation.
- Use `connect` to link existing records.
- Use `disconnect` to remove relationships.
- Use `delete` to remove related records.
- Use `update` with nested data to update related records.
- Use `upsert` for create-or-update operations.

```typescript
// Good: Creating application with nested documents
const application = await db.application.create({
  data: {
    userId,
    status: "DRAFT",
    documents: {
      create: [
        { type: "PASSPORT", url: "..." },
        { type: "PHOTO", url: "..." },
      ],
    },
  },
  include: { documents: true },
});

// Good: Connecting existing user to application
const application = await db.application.create({
  data: {
    status: "DRAFT",
    user: {
      connect: { id: userId },
    },
  },
});

// Good: Updating with nested operations
const application = await db.application.update({
  where: { id },
  data: {
    status: "SUBMITTED",
    documents: {
      create: { type: "ADDITIONAL_DOC", url: "..." },
      updateMany: {
        where: { verified: false },
        data: { verified: true },
      },
    },
  },
});

// Good: Upsert operation
const setting = await db.userSettings.upsert({
  where: { userId },
  update: { notificationsEnabled: true },
  create: { userId, notificationsEnabled: true },
});
```

## Aggregations & Grouping
- Use `count`, `aggregate`, `groupBy` for data analysis.
- Use `_count`, `_sum`, `_avg`, `_min`, `_max` in aggregations.
- Combine with `where` filters for conditional aggregations.

```typescript
// Good: Counting applications by status
const statusCounts = await db.application.groupBy({
  by: ["status"],
  _count: { id: true },
  where: { userId },
});

// Good: Aggregating payment amounts
const paymentStats = await db.payment.aggregate({
  where: { userId },
  _sum: { amount: true },
  _avg: { amount: true },
  _count: { id: true },
});

// Good: Counting with filtering
const draftCount = await db.application.count({
  where: { userId, status: "DRAFT" },
});
```

## Raw Queries (Use Sparingly)
- Use `db.$queryRaw` or `db.$executeRaw` only when Prisma's query API is insufficient.
- Use parameterized queries to prevent SQL injection.
- Use Prisma's `Prisma.sql` template tag for type-safe raw queries.
- Document why raw SQL is necessary in comments.

```typescript
import { Prisma } from "@prisma/client";

// Good: Type-safe raw query with parameters
const applications = await db.$queryRaw<Application[]>`
  SELECT * FROM "Application"
  WHERE "userId" = ${userId}
  AND "submittedAt" > ${startDate}
  ORDER BY "submittedAt" DESC
`;

// Good: Using Prisma.sql for complex queries
const result = await db.$queryRaw(
  Prisma.sql`
    SELECT a.*, COUNT(d.id) as documentCount
    FROM "Application" a
    LEFT JOIN "Document" d ON d."applicationId" = a.id
    WHERE a."userId" = ${userId}
    GROUP BY a.id
  `
);

// Bad: String interpolation (SQL injection risk!)
const applications = await db.$queryRaw`
  SELECT * FROM Application WHERE userId = '${userId}'
`; // ❌ Never do this
```

## Connection Management
- Use connection pooling in production (configure in DATABASE_URL).
- Set appropriate connection limits based on deployment environment.
- Use `db.$disconnect()` when shutting down the application.
- Handle connection errors gracefully.

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pooling is handled via DATABASE_URL connection string
}

// Connection URL with pooling (example)
// DATABASE_URL="postgresql://user:password@host:5432/dbname?connection_limit=10"
```

## Testing with Prisma
- Use a separate test database for integration tests.
- Mock Prisma Client in unit tests using jest mocks or libraries like `jest-mock-extended`.
- Reset database state between tests.
- Use transactions in tests to rollback changes.

```typescript
// Unit test with mocked Prisma Client
import { mockDeep } from "jest-mock-extended";
import type { PrismaClient } from "@prisma/client";

const prismaMock = mockDeep<PrismaClient>();

describe("Application Service", () => {
  it("should fetch application by id", async () => {
    const mockApplication = { id: "1", status: "DRAFT", userId: "user1" };
    prismaMock.application.findUnique.mockResolvedValue(mockApplication as any);

    const result = await getApplicationById("1");
    expect(result).toEqual(mockApplication);
  });
});
```

## Common Patterns

### Soft Deletes
```typescript
// Schema with soft delete field
model Application {
  id        String    @id @default(uuid())
  deletedAt DateTime?
  // ... other fields
}

// Exclude deleted records by default
const activeApplications = await db.application.findMany({
  where: { deletedAt: null },
});

// Soft delete operation
await db.application.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

### Timestamps
```typescript
// Always use @default(now()) and @updatedAt
model Application {
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ... other fields
}
```

### Enums
```typescript
// Define enums in schema for type safety
enum ApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
}

model Application {
  status ApplicationStatus @default(DRAFT)
  // ... other fields
}
```

## Performance Best Practices
- ✅ Use indexes for frequently queried fields.
- ✅ Use `select` to fetch only needed fields.
- ✅ Use `include` to avoid N+1 queries.
- ✅ Use pagination for large result sets.
- ✅ Use transactions for multi-step operations.
- ✅ Monitor query performance with Prisma's logging.
- ❌ Don't fetch entire models when you only need specific fields.
- ❌ Don't make multiple separate queries when one with `include` suffices.
- ❌ Don't forget to add indexes for foreign keys and frequently filtered fields.

## Anti-Patterns to Avoid
- ❌ Creating multiple Prisma Client instances.
- ❌ Using raw SQL for simple CRUD operations.
- ❌ Modifying the database schema manually.
- ❌ Ignoring migration conflicts or errors.
- ❌ Not using transactions for multi-step operations.
- ❌ Fetching more data than needed (no `select`).
- ❌ Not handling Prisma errors appropriately.
- ❌ Using string interpolation in raw queries (SQL injection risk).
- ❌ Not using connection pooling in production.
- ❌ Forgetting to run migrations before deploying.

## Development Workflow
1. Make schema changes in `prisma/schema.prisma`.
2. Generate migration: `npx prisma migrate dev --name descriptive-name`.
3. Review generated migration file.
4. Test changes locally.
5. Commit both schema and migration files.
6. Deploy migrations to production: `npx prisma migrate deploy`.
7. Generate Prisma Client: `npx prisma generate` (usually automatic).

## Production Checklist
- ✅ Use connection pooling in DATABASE_URL.
- ✅ Set appropriate connection limits.
- ✅ Use `prisma migrate deploy` (not `migrate dev`).
- ✅ Monitor database performance and slow queries.
- ✅ Implement proper error handling and logging.
- ✅ Use transactions for critical operations.
- ✅ Test migrations in staging environment first.
- ✅ Back up database before running migrations.
- ✅ Set up database monitoring and alerting.
- ✅ Use read replicas for read-heavy workloads if needed.
