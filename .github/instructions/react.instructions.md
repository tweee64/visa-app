---
applyTo: '**/*'
---
# React & Next.js Development Instructions

## Component Structure & Organization
- Use React Server Components (RSC) by default in Next.js App Router for optimal performance.
- Add `'use client'` directive only when necessary (state, effects, browser APIs, event handlers).
- Organize components by feature in `_components` directories within app routes.
- Use PascalCase for component files and names (e.g., `VisaApplicationForm.tsx`).
- Keep components small and focused; extract logic into custom hooks or utilities.
- Place shared components in `src/components` (create if needed).
- Co-locate component-specific utilities, types, and tests with the component.

## TypeScript & Props
- Define explicit TypeScript interfaces for all component props.
- Use `interface` for component props and object shapes; use `type` for unions and function signatures.
- Avoid using `any` type; use `unknown` with type guards when type is uncertain.
- Export prop interfaces when components are shared across multiple files.
- Use proper TypeScript generics for reusable components.
- Leverage TypeScript's strict mode features (enabled in tsconfig.json).

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({ onClick, variant, children, disabled = false }: ButtonProps) {
  // Implementation
}

// Bad
export function Button(props: any) {
  // Implementation
}
```

## Server vs Client Components
- **Server Components** (default): Use for data fetching, layout, static content, SEO-critical content.
- **Client Components** (`'use client'`): Use for interactivity, hooks (useState, useEffect), browser APIs, event handlers.
- Prefer Server Components at the root and use Client Components as leaves when possible.
- Pass data from Server Components to Client Components via props.
- Use tRPC client hooks only in Client Components.

```typescript
// Server Component (default)
async function VisaApplicationPage() {
  const data = await db.application.findMany();
  return <ApplicationList initialData={data} />;
}

// Client Component
'use client';
function ApplicationList({ initialData }: { initialData: Application[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  // Interactive logic
}
```

## Hooks & State Management
- Use `useState` for local component state.
- Use `useEffect` sparingly; prefer Server Components and tRPC for data fetching.
- Use `useCallback` to memoize callbacks passed as props to prevent unnecessary re-renders.
- Use `useMemo` to memoize expensive computations.
- Use custom hooks to extract and share stateful logic.
- Prefix custom hook names with `use` (e.g., `useVisaApplication`).
- Keep hooks at the top of the component; do not call conditionally.

```typescript
// Custom hook example
function useVisaApplication(applicationId: string) {
  const utils = api.useUtils();
  const { data, isLoading } = api.application.getById.useQuery({ id: applicationId });
  const updateMutation = api.application.update.useMutation({
    onSuccess: () => utils.application.getById.invalidate({ id: applicationId }),
  });
  
  return { application: data, isLoading, updateApplication: updateMutation.mutate };
}
```

## Data Fetching with tRPC
- Use tRPC React hooks (`api.*.useQuery`, `api.*.useMutation`) in Client Components.
- Use `api.*.invalidate` to refresh data after mutations.
- Implement optimistic updates for better UX in forms.
- Handle loading and error states explicitly.
- Use `enabled` option to conditionally fetch data.
- Prefetch data in Server Components when possible.

```typescript
'use client';
function ApplicationForm({ id }: { id: string }) {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.application.getById.useQuery({ id });
  const updateMutation = api.application.update.useMutation({
    onSuccess: async () => {
      await utils.application.getById.invalidate({ id });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!data) return <NotFound />;

  // Form implementation
}
```

## Styling with Tailwind CSS
- Use Tailwind utility classes for all styling.
- Follow mobile-first responsive design with breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
- Use consistent spacing scale (4, 8, 12, 16, 24, 32, etc.).
- Extract repeated patterns into reusable components, not arbitrary class utilities.
- Use `clsx` or `cn` utility for conditional classes.
- Avoid inline styles unless absolutely necessary.
- Use Tailwind's color palette; define custom colors in `tailwind.config.ts` if needed.

```typescript
// Good
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
  Submit
</button>

// Conditional classes
import { clsx } from 'clsx';

<div className={clsx(
  'rounded-lg p-4',
  isActive ? 'bg-blue-100' : 'bg-gray-100',
  isLarge && 'p-6'
)} />
```

## Forms & User Input
- Use controlled components for form inputs (value + onChange).
- Validate inputs on the client side before submission.
- Use Zod schemas for validation (matching backend tRPC schemas when possible).
- Provide clear, accessible error messages for validation failures.
- Disable submit buttons during submission to prevent double-submits.
- Show loading states during form submission.
- Implement optimistic updates for better perceived performance.

```typescript
'use client';
function ApplicationForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mutation = api.application.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      await mutation.mutateAsync(formData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? 'name-error' : undefined}
      />
      {errors.name && <span id="name-error" className="text-red-600">{errors.name}</span>}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Performance Optimization
- Use `React.memo()` to prevent unnecessary re-renders of expensive components.
- Use `useCallback` for functions passed as props to memoized components.
- Use `useMemo` for expensive computations that depend on specific values.
- Use Next.js `<Image>` component for optimized image loading.
- Implement code splitting with dynamic imports for large components.
- Avoid large inline objects/arrays in JSX (extract to constants).
- Use React Server Components to reduce client bundle size.

```typescript
// Memoized component
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
});

// Parent component
function ParentComponent() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => getItems(), []);
  const handleClick = useCallback(() => setCount(c => c + 1), []);
  
  return <ExpensiveList items={items} />;
}
```

## Accessibility (a11y)
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`, etc.).
- Provide meaningful `alt` text for images.
- Use proper heading hierarchy (`<h1>` to `<h6>`).
- Add ARIA labels when semantic HTML is insufficient (`aria-label`, `aria-describedby`).
- Ensure keyboard navigation works (tab order, focus states).
- Use sufficient color contrast for text and interactive elements.
- Test with screen readers and keyboard-only navigation.
- Add focus-visible styles for keyboard navigation.

```typescript
<button
  onClick={handleDelete}
  aria-label="Delete application"
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
>
  <TrashIcon aria-hidden="true" />
</button>
```

## Error Handling
- Implement React Error Boundaries for graceful error handling.
- Show user-friendly error messages, not technical stack traces.
- Log errors appropriately for debugging.
- Provide fallback UI for error states.
- Handle network errors and timeouts in data fetching.

```typescript
// Error boundary component
'use client';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

## Mobile-First & Responsive Design
- Design for mobile devices first, then enhance for larger screens.
- Use touch-friendly tap targets (minimum 44x44px).
- Test on various screen sizes and devices.
- Use responsive Tailwind breakpoints consistently.
- Implement appropriate touch gestures for mobile interactions.
- Optimize images and assets for mobile bandwidth.
- Consider mobile viewport units and safe areas.

```typescript
// Responsive layout example
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</div>

// Mobile-friendly button
<button className="h-12 min-w-[44px] rounded-lg px-4 text-base">
  Tap me
</button>
```

## Testing
- Write tests using Jest and React Testing Library.
- Test component behavior, not implementation details.
- Use `screen` queries from Testing Library (prefer `getByRole`, `getByLabelText`).
- Mock tRPC hooks in component tests.
- Test user interactions (clicks, form submissions, etc.).
- Test loading and error states.
- Use `userEvent` for simulating user interactions instead of `fireEvent`.

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ApplicationForm', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<ApplicationForm />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Common Anti-Patterns to Avoid
- ❌ Using `any` type without justification.
- ❌ Adding `'use client'` to components that don't need client-side features.
- ❌ Fetching data in `useEffect` instead of using tRPC hooks or Server Components.
- ❌ Not handling loading and error states in data fetching.
- ❌ Creating deeply nested component trees (prefer flat structure).
- ❌ Mutating props or state directly (use immutable updates).
- ❌ Using index as key in lists (use stable unique IDs).
- ❌ Not memoizing callbacks passed to child components when needed.
- ❌ Ignoring accessibility requirements.
- ❌ Not testing components.

## Next.js Specific Best Practices
- Use App Router file-based routing conventions.
- Implement proper metadata for SEO using Next.js metadata API.
- Use `loading.tsx` for loading states and `error.tsx` for error boundaries.
- Use `route.ts` for API routes when tRPC is not sufficient.
- Leverage Next.js Image component for automatic optimization.
- Use proper caching strategies with Server Components.
- Implement proper route grouping with `(group)` folders.

```typescript
// app/applications/[id]/page.tsx
import { type Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const application = await db.application.findUnique({ where: { id: params.id } });
  return {
    title: `Application ${application?.id ?? 'Not Found'}`,
    description: 'Visa application details',
  };
}

export default async function ApplicationPage({ params }: { params: { id: string } }) {
  const application = await db.application.findUnique({ where: { id: params.id } });
  return <ApplicationDetails application={application} />;
}
```
