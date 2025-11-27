---
applyTo: '**/*'
---
# Repository Instructions

## Project Overview
This is a visa application management system built with the T3 Stack (Next.js 15, TypeScript, tRPC, Prisma, Tailwind CSS). The application helps users submit and track visa applications, manage required documents, and handle payment workflows.

## Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: tRPC for type-safe API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: (To be implemented)
- **Deployment**: (To be configured)

## Project Structure

### Core Directories
- `src/app/` - Next.js App Router pages and layouts (file-based routing)
- `src/app/_components/` - Page-specific components
- `src/components/` - Shared/reusable components (create if needed)
- `src/server/` - Backend logic (tRPC routers, database access)
- `src/server/api/routers/` - tRPC procedure routers organized by feature
- `src/trpc/` - tRPC client configuration and React hooks
- `prisma/` - Database schema and migrations
- `public/` - Static assets (images, fonts, etc.)
- `.github/instructions/` - AI-assisted development instructions

### Key Files
- `src/server/db.ts` - Centralized Prisma Client instance
- `src/server/api/root.ts` - Root tRPC router combining all feature routers
- `src/server/api/trpc.ts` - tRPC context and procedure definitions
- `src/env.js` - Environment variable validation with Zod
- `prisma/schema.prisma` - Database schema definition
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Development Workflow

### Getting Started
1. **Install Dependencies**: `npm install`
2. **Set Up Database**: Configure `DATABASE_URL` in `.env`
3. **Run Migrations**: `npm run db:push` (development) or `npx prisma migrate dev`
4. **Generate Prisma Client**: `npx prisma generate` (usually automatic)
5. **Start Development Server**: `npm run dev`
6. **Open Application**: Navigate to `http://localhost:3000`

### Common Commands
```bash
# Development
npm run dev           # Start Next.js dev server
npm run build         # Build for production
npm start             # Start production server
npm run check         # Run linting and type checking

# Database
npm run db:push       # Push schema changes to database (dev)
npm run db:studio     # Open Prisma Studio GUI
npx prisma migrate dev --name <name>  # Create and apply migration
npx prisma migrate deploy             # Apply migrations (production)
npx prisma generate                   # Generate Prisma Client

# Code Quality
npm run lint          # Run ESLint
npm run format        # Run Prettier formatting
npm run type-check    # Run TypeScript compiler check
npm test              # Run tests (when configured)
```

### Database Management
- **Development**: Use `npm run db:push` for rapid prototyping
- **Production**: Always use migrations (`prisma migrate dev` → `prisma migrate deploy`)
- **Schema Changes**: Modify `prisma/schema.prisma`, then run migration commands
- **Data Inspection**: Use `npm run db:studio` to view and edit data via Prisma Studio
- **Centralized Client**: Always import from `~/server/db`, never create new Prisma Client instances

### Environment Variables
Required environment variables in `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/visa_app"
NODE_ENV="development"
# Add authentication variables when implemented
# Add payment gateway variables when implemented
```

Use `src/env.js` to add and validate new environment variables with Zod schemas.

## Feature Organization

### Domain-Driven Structure
Organize code by feature/domain, not by technical layer:

```
src/
  app/
    applications/              # Visa applications feature
      page.tsx                 # List applications
      [id]/                    # Application detail
        page.tsx
      _components/             # Application-specific components
        ApplicationForm.tsx
        ApplicationCard.tsx
    documents/                 # Document management feature
      page.tsx
      _components/
    payments/                  # Payment feature
      page.tsx
      _components/
  server/
    api/
      routers/
        application.ts         # Application tRPC procedures
        document.ts            # Document tRPC procedures
        payment.ts             # Payment tRPC procedures
```

### Adding New Features
1. **Create Database Models**: Add models to `prisma/schema.prisma`
2. **Run Migration**: `npx prisma migrate dev --name add-feature-name`
3. **Create tRPC Router**: Add router in `src/server/api/routers/featureName.ts`
4. **Register Router**: Import and add to `src/server/api/root.ts`
5. **Create UI Components**: Add pages and components in `src/app/feature-name/`
6. **Use tRPC Hooks**: Call `api.featureName.procedureName.useQuery/useMutation` in Client Components

### Example Feature Implementation

#### 1. Database Schema (prisma/schema.prisma)
```prisma
model Application {
  id          String   @id @default(uuid())
  userId      String
  status      ApplicationStatus @default(DRAFT)
  submittedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  documents   Document[]
  payments    Payment[]

  @@index([userId])
  @@index([status])
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
}
```

#### 2. tRPC Router (src/server/api/routers/application.ts)
```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const applicationRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.application.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.application.findUnique({
        where: { id: input.id },
        include: { documents: true, payments: true },
      });
    }),

  create: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.application.create({
        data: { userId: input.userId, status: "DRAFT" },
      });
    }),
});
```

#### 3. Register Router (src/server/api/root.ts)
```typescript
import { applicationRouter } from "~/server/api/routers/application";

export const appRouter = createCallerFactory(createTRPCRouter)({
  post: postRouter,
  application: applicationRouter,
});
```

#### 4. UI Component (src/app/applications/_components/ApplicationCard.tsx)
```typescript
'use client';

interface ApplicationCardProps {
  application: {
    id: string;
    status: string;
    submittedAt: Date | null;
  };
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Application {application.id}</h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {application.status}
        </span>
      </div>
      {application.submittedAt && (
        <p className="mt-2 text-sm text-gray-600">
          Submitted: {application.submittedAt.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
```

## Code Organization Best Practices

### File Naming Conventions
- **Components**: PascalCase (e.g., `ApplicationForm.tsx`, `UserMenu.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validation.ts`)
- **Pages**: kebab-case or lowercase (Next.js convention: `page.tsx`, `layout.tsx`)
- **tRPC Routers**: camelCase (e.g., `application.ts`, `userProfile.ts`)

### Import Aliases
Use the `~/*` alias for absolute imports from `src/`:
```typescript
import { db } from "~/server/db";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/Button";
```

### Component Organization
```typescript
// 1. Imports (external, then internal)
import { useState } from 'react';
import { api } from '~/trpc/react';

// 2. Types/Interfaces
interface Props {
  id: string;
}

// 3. Component definition
export function MyComponent({ id }: Props) {
  // 4. Hooks (in order: state, context, custom hooks, effects)
  const [value, setValue] = useState('');
  const { data } = api.application.getById.useQuery({ id });
  
  // 5. Event handlers
  const handleSubmit = () => {
    // Handler logic
  };
  
  // 6. Render logic (early returns)
  if (!data) return <Loading />;
  
  // 7. Main render
  return <div>{/* JSX */}</div>;
}
```

## Testing Strategy (To Be Implemented)

### Unit Tests
- Test utilities and pure functions with Jest
- Test React components with React Testing Library
- Mock tRPC hooks and database calls

### Integration Tests
- Test tRPC procedures with test database
- Test API workflows end-to-end
- Use transactions to rollback test data

### E2E Tests (Future)
- Test critical user flows (application submission, payment, etc.)
- Use Playwright or Cypress for browser automation

## Performance Considerations

### Next.js Optimization
- Use Server Components by default for better performance
- Add `'use client'` only when needed (state, effects, browser APIs)
- Leverage Next.js Image component for optimized images
- Implement proper metadata for SEO

### Database Optimization
- Add indexes for frequently queried fields (userId, status, createdAt, etc.)
- Use `select` to fetch only needed fields
- Use `include` to avoid N+1 queries
- Use Prisma's connection pooling in production

### Bundle Optimization
- Keep Client Components minimal and focused
- Use dynamic imports for large components
- Optimize images and assets
- Monitor bundle size with Next.js build output

## Security Best Practices

### Input Validation
- Validate all API inputs with Zod schemas in tRPC procedures
- Sanitize user inputs before database operations
- Use Prisma's parameterized queries (never raw SQL with string interpolation)

### Authentication & Authorization (To Be Implemented)
- Implement protected procedures in tRPC
- Validate user sessions/tokens in tRPC context
- Use row-level security with userId checks
- Implement role-based access control (RBAC) if needed

### Data Protection
- Never expose sensitive data in API responses
- Use environment variables for secrets (never commit `.env`)
- Implement rate limiting for API routes
- Sanitize error messages (no stack traces to users)

## Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run check` (lint + type check)
- [ ] Run `npm run build` successfully
- [ ] Test migrations in staging environment
- [ ] Review environment variables for production
- [ ] Update `DATABASE_URL` with connection pooling
- [ ] Configure error logging and monitoring

### Production Database
- [ ] Use `npx prisma migrate deploy` (never `db:push`)
- [ ] Back up database before migrations
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Set up database monitoring

### Post-Deployment
- [ ] Verify application functionality
- [ ] Monitor error logs and performance
- [ ] Test critical user flows
- [ ] Verify database connections
- [ ] Check API response times

## Troubleshooting

### Common Issues

#### Prisma Client Not Found
```bash
# Solution: Generate Prisma Client
npx prisma generate
```

#### Database Connection Errors
- Check `DATABASE_URL` in `.env`
- Verify database is running (PostgreSQL)
- Check connection pooling configuration
- Review database logs

#### Build Errors
- Run `npm run check` to identify issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

#### Migration Conflicts
- In development: Use `npx prisma migrate reset` (caution: data loss)
- In production: Never reset; resolve conflicts manually
- Always test migrations in staging first

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- Feature branches: `feature/application-form`, `feature/payment-integration`
- Bug fixes: `fix/application-status-bug`

### Commit Messages
Follow conventional commits:
```
feat: add application status filter
fix: resolve payment calculation error
docs: update README with deployment instructions
refactor: extract validation logic to utility
test: add tests for application service
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `develop`
2. Implement feature with tests
3. Run `npm run check` before committing
4. Create PR with clear description
5. Request code review
6. Merge after approval and CI passes

## Code Review Guidelines

### Review Checklist
- [ ] Code follows project instructions and best practices
- [ ] TypeScript types are properly defined (no `any`)
- [ ] Components are properly structured (Server vs Client)
- [ ] tRPC procedures have proper input validation
- [ ] Database queries are optimized (indexes, select, include)
- [ ] Error handling is implemented
- [ ] Accessibility requirements are met
- [ ] Mobile-responsive design is implemented
- [ ] Tests are included (when applicable)
- [ ] No sensitive data or secrets are exposed

### What to Look For
- ✅ Clear, readable code with proper naming
- ✅ Consistent styling with Tailwind utilities
- ✅ Proper error handling and user feedback
- ✅ Type safety and no TypeScript errors
- ✅ Performance considerations (memoization, pagination, etc.)
- ❌ Magic numbers/strings without constants
- ❌ Duplicate code that should be extracted
- ❌ Missing input validation
- ❌ Poor accessibility (missing labels, insufficient contrast, etc.)
- ❌ Overly complex logic that needs refactoring

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Project-Specific Instructions
- `.github/instructions/code-quality.instructions.md` - General code quality principles
- `.github/instructions/prisma.instructions.md` - Prisma ORM best practices
- `.github/instructions/react.instructions.md` - React & Next.js guidelines
- `.github/instructions/tailwind.instructions.md` - Tailwind CSS styling guidelines

## Contributing

When contributing to this project:
1. Read all instruction files in `.github/instructions/`
2. Follow the established patterns and conventions
3. Write tests for new features
4. Update documentation as needed
5. Request code review before merging
6. Ensure all checks pass (lint, type check, tests)

## Support & Contact

For questions or issues:
- Check documentation and instruction files first
- Review existing code for similar patterns
- Consult team members for guidance
- Document solutions for future reference
