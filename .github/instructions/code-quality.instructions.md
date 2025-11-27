---
applyTo: '**'
---
# Code Quality Instructions

## Principles
- Follow Next.js 15 App Router best practices for full-stack development.
- Follow React 19 best practices for responsive frontend development across websites and mobile devices.
- Apply SOLID, DRY, and KISS principles in all code.
- Use TypeScript for all code with strict type checking enabled.
- Prefer functional React components with hooks and React Server Components where appropriate.
- Keep components, functions, and methods small, focused, and reusable.
- Validate all API inputs using Zod schemas in tRPC procedures.
- Use Prisma best practices for database access and schema design.
- Avoid magic numbers/strings; use constants, enums, or configuration.
- Write clear, descriptive comments and documentation for all non-trivial logic.
- Ensure all code is covered by unit and integration tests.
- Design for mobile-first with progressive enhancement for desktop websites.
- Leverage Next.js Server Components for improved performance and SEO in visa application workflows.

## Linting & Formatting
- **Frontend & Backend**: Use ESLint with Next.js recommended rules and TypeScript ESLint.
- Use Prettier with Tailwind CSS plugin for code formatting; do not override formatting rules without strong justification.
- Fix all lint and formatting errors before committing.
- Follow consistent naming conventions: PascalCase for React components and types, camelCase for functions/variables.
- Run `npm run check` to verify both linting and type checking before commits.

## Testing
- Write unit tests using Jest and React Testing Library for components and business logic.
- Write integration tests for tRPC procedures and API routes.
- Use mocks/stubs for external dependencies in tests (Prisma, external APIs).
- Ensure tests are deterministic and do not rely on external state.
- Test both happy path and error scenarios for critical visa application workflows.
- Mock database calls in unit tests; use test database for integration tests.

## General
- Do not duplicate code; extract shared logic into utilities or hooks.
- Do not introduce unnecessary complexity; keep solutions as simple as possible.
- Document all public APIs and exported functions.
- Review code for security, performance, and accessibility issues before merging.

## Backend Specific (tRPC & Prisma)
- Organize tRPC routers by feature domain (e.g., applications, documents, payments).
- Use Zod schemas for input validation in all tRPC procedures.
- Implement proper error handling with tRPC error codes (BAD_REQUEST, UNAUTHORIZED, etc.).
- Use Prisma migrations for database schema changes; never manually modify the database.
- Leverage Prisma's type safety and avoid raw SQL queries unless absolutely necessary.
- Use transactions for operations that modify multiple tables.
- Implement proper logging and monitoring for API procedures.
- Use `publicProcedure` for unauthenticated endpoints and create `protectedProcedure` for authenticated ones.
- Keep tRPC procedures focused and single-purpose; extract complex logic to service functions.
- Use Prisma include/select to optimize database queries and avoid N+1 problems.

## Frontend Specific (Next.js & React)
- Use Next.js App Router with Server Components by default for better performance.
- Use Client Components (`'use client'`) only when needed (interactivity, hooks, browser APIs).
- Implement proper TypeScript interfaces for all component props.
- Use React hooks (useState, useEffect, useCallback, useMemo) appropriately.
- Leverage TanStack Query (React Query) via tRPC for data fetching and caching.
- Implement proper error boundaries for graceful error handling.
- Use React.memo() for performance optimization when appropriate.
- Use Tailwind CSS for styling with consistent utility classes.
- Implement proper accessibility features (ARIA labels, semantic HTML, keyboard navigation).
- Design mobile-first with responsive breakpoints for optimal website and mobile device experiences.
- Use touch-friendly interface patterns for mobile devices and mouse-optimized patterns for desktop websites.
- Implement loading states and optimistic updates for better UX in visa application forms.
- Use Next.js Image component for optimized image loading.
- Leverage Next.js metadata API for SEO optimization.

## Typescript
- Do not or prevent using any `any` types; use specific types or generics.
- Use interfaces for object shapes and types for function signatures.
- Use `unknown` type for values that can be anything but need validation before use.