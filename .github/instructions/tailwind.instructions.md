---
applyTo: '**/*'
---
# Tailwind CSS Styling Instructions

## Core Principles
- Use Tailwind utility classes exclusively for styling; avoid custom CSS unless absolutely necessary.
- Follow mobile-first responsive design with Tailwind breakpoints.
- Maintain consistent spacing, colors, and typography using Tailwind's design system.
- Keep utility classes readable by organizing them logically (layout → spacing → colors → typography → effects).
- Extract repeated utility patterns into reusable React components, not arbitrary CSS utilities.
- Use the `clsx` or `cn` utility function for conditional classes.

## Responsive Design
- Design mobile-first, then progressively enhance for larger screens.
- Use Tailwind breakpoints in order: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px).
- Apply base styles without breakpoint prefixes (mobile-first).
- Add breakpoint-specific overrides as needed for larger screens.

```typescript
// Good: Mobile-first approach
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  {/* Content */}
</div>

// Bad: Desktop-first approach
<div className="flex flex-row gap-8 md:gap-6 sm:flex-col sm:gap-4">
  {/* Content */}
</div>
```

## Spacing & Layout
- Use Tailwind's spacing scale consistently: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, etc.
- Prefer gap utilities (`gap-4`, `gap-x-6`, `gap-y-8`) for flexbox and grid spacing.
- Use padding (`p-4`, `px-6`, `py-2`) and margin (`m-4`, `mx-auto`, `my-8`) appropriately.
- Use `space-x-*` and `space-y-*` utilities sparingly; prefer `gap-*` for flex/grid layouts.
- Use `container` utility with appropriate max-width for content sections.

```typescript
// Good: Consistent spacing with gap
<div className="flex flex-col gap-6 p-6">
  <header className="flex items-center justify-between">
    <h1 className="text-2xl font-bold">Title</h1>
    <button>Action</button>
  </header>
  <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {items.map(item => <Card key={item.id} {...item} />)}
  </main>
</div>
```

## Colors
- Use Tailwind's color palette with appropriate shades (50-950).
- Use semantic colors: `blue` for primary actions, `red` for errors/danger, `green` for success, `gray` for neutral.
- Maintain consistent color usage across the application for similar UI patterns.
- Use `text-*` for text colors, `bg-*` for backgrounds, `border-*` for borders.
- Use hover states with `hover:` prefix for interactive elements.
- Consider dark mode support using `dark:` prefix if applicable.

```typescript
// Good: Semantic color usage
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
  Submit Application
</button>

<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
  <p className="font-medium">Error: Please fix the following issues</p>
</div>

<div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
  <p className="font-medium">Success: Application submitted</p>
</div>
```

## Typography
- Use Tailwind's font size utilities: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.
- Use font weight utilities: `font-normal`, `font-medium`, `font-semibold`, `font-bold`.
- Use line height utilities when needed: `leading-tight`, `leading-normal`, `leading-relaxed`.
- Maintain consistent typography hierarchy across the application.
- Use `truncate` for single-line text overflow, `line-clamp-*` for multi-line.

```typescript
// Good: Consistent typography hierarchy
<article className="space-y-4">
  <h1 className="text-3xl font-bold leading-tight text-gray-900">
    Visa Application Guide
  </h1>
  <h2 className="text-xl font-semibold text-gray-800">
    Required Documents
  </h2>
  <p className="text-base leading-relaxed text-gray-700">
    Please prepare the following documents for your application...
  </p>
  <small className="text-sm text-gray-500">
    Last updated: November 2025
  </small>
</article>
```

## Interactive Elements
- Ensure touch targets are at least 44x44px for mobile devices (`h-11`, `min-w-[44px]`).
- Use appropriate padding for buttons: `px-4 py-2` (small), `px-6 py-3` (medium), `px-8 py-4` (large).
- Add hover states to interactive elements using `hover:` prefix.
- Add focus states for keyboard navigation using `focus:` or `focus-visible:` prefix.
- Use `cursor-pointer` for clickable elements, `cursor-not-allowed` for disabled states.
- Add `transition` utilities for smooth state changes.

```typescript
// Good: Accessible, touch-friendly button
<button
  className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-base font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  disabled={isLoading}
>
  {isLoading ? 'Processing...' : 'Submit'}
</button>

// Good: Interactive card
<div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
  {/* Card content */}
</div>
```

## Forms & Inputs
- Style form inputs consistently with proper sizing and spacing.
- Use `ring-*` utilities for focus states instead of default browser outlines.
- Add proper error states with red colors and borders.
- Ensure labels are properly associated with inputs (accessibility).
- Use `placeholder:` prefix for placeholder text styling.

```typescript
// Good: Consistent form input styling
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-base transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
    placeholder="you@example.com"
  />
</div>

// Good: Error state
<div className="space-y-2">
  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    Full Name
  </label>
  <input
    id="name"
    type="text"
    className="block w-full rounded-lg border border-red-300 px-4 py-2 text-base focus:border-red-500 focus:ring-2 focus:ring-red-500"
    aria-invalid="true"
    aria-describedby="name-error"
  />
  <p id="name-error" className="text-sm text-red-600">
    This field is required
  </p>
</div>
```

## Layout Patterns
- Use Flexbox for one-dimensional layouts: `flex`, `flex-col`, `items-center`, `justify-between`.
- Use Grid for two-dimensional layouts: `grid`, `grid-cols-*`, `gap-*`.
- Use `container` with `mx-auto` for centered page content.
- Use `max-w-*` utilities to constrain content width appropriately.

```typescript
// Good: Responsive grid layout
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {applications.map(app => (
      <ApplicationCard key={app.id} application={app} />
    ))}
  </div>
</div>

// Good: Flexbox header layout
<header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    <div className="flex items-center gap-4">
      <Logo />
      <nav className="hidden md:flex md:gap-6">
        <NavLink href="/applications">Applications</NavLink>
        <NavLink href="/documents">Documents</NavLink>
      </nav>
    </div>
    <UserMenu />
  </div>
</header>
```

## Cards & Containers
- Use consistent card styling with borders, shadows, and rounded corners.
- Apply appropriate padding based on card size and content.
- Use shadow utilities sparingly: `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`.
- Add hover effects for interactive cards.

```typescript
// Good: Consistent card component
<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
    <p className="mt-2 text-sm text-gray-600">Card description and content</p>
  </div>
  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
      View Details
    </button>
  </div>
</div>
```

## Conditional Classes
- Use `clsx` or create a `cn` utility function for conditional classes.
- Keep conditional logic readable and maintainable.
- Group related classes together in the conditional.

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in components
<button
  className={cn(
    'rounded-lg px-4 py-2 font-medium transition-colors',
    variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
    variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
    size === 'sm' && 'h-9 px-3 text-sm',
    size === 'md' && 'h-11 px-4 text-base',
    size === 'lg' && 'h-12 px-6 text-lg',
    disabled && 'cursor-not-allowed opacity-50',
  )}
>
  {children}
</button>
```

## Animations & Transitions
- Use `transition-*` utilities for smooth state changes.
- Keep animations subtle and purposeful (e.g., `duration-200`, `ease-in-out`).
- Use `animate-*` utilities for simple animations: `animate-spin`, `animate-pulse`, `animate-bounce`.
- For complex animations, consider using CSS keyframes in global styles or libraries.

```typescript
// Good: Smooth transitions
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700">
  Hover Me
</button>

// Good: Loading spinner
<div className="flex items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
</div>

// Good: Slide-in notification
<div className="transform transition-transform duration-300 ease-in-out translate-x-0 data-[state=closed]:translate-x-full">
  <div className="rounded-lg bg-green-50 p-4 shadow-lg">
    <p className="text-green-800">Success message</p>
  </div>
</div>
```

## Accessibility Considerations
- Use `sr-only` class for screen-reader-only content.
- Ensure sufficient color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text).
- Add focus-visible styles for keyboard navigation.
- Use proper semantic HTML with Tailwind classes, not divs for everything.

```typescript
// Good: Screen reader text
<button className="inline-flex items-center gap-2">
  <TrashIcon className="h-5 w-5" aria-hidden="true" />
  <span className="sr-only">Delete application</span>
</button>

// Good: Accessible focus styles
<a
  href="/applications"
  className="rounded-lg px-4 py-2 text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
>
  View Applications
</a>
```

## Common Patterns & Components

### Loading States
```typescript
<div className="flex items-center justify-center py-12">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
</div>
```

### Empty States
```typescript
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="mb-4 rounded-full bg-gray-100 p-4">
    <InboxIcon className="h-12 w-12 text-gray-400" />
  </div>
  <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
  <p className="mt-2 text-sm text-gray-500">Get started by creating a new application.</p>
  <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
    Create Application
  </button>
</div>
```

### Alert/Notification
```typescript
// Success
<div className="rounded-lg border border-green-200 bg-green-50 p-4">
  <div className="flex items-start gap-3">
    <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
    <div>
      <h4 className="font-medium text-green-800">Success</h4>
      <p className="mt-1 text-sm text-green-700">Your application has been submitted.</p>
    </div>
  </div>
</div>

// Error
<div className="rounded-lg border border-red-200 bg-red-50 p-4">
  <div className="flex items-start gap-3">
    <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-600" />
    <div>
      <h4 className="font-medium text-red-800">Error</h4>
      <p className="mt-1 text-sm text-red-700">Please fix the following issues before submitting.</p>
    </div>
  </div>
</div>
```

## Anti-Patterns to Avoid
- ❌ Don't use arbitrary values excessively (e.g., `w-[347px]`); prefer standard spacing scale.
- ❌ Don't write custom CSS unless Tailwind truly cannot achieve the desired result.
- ❌ Don't use `@apply` directive to create arbitrary utility classes; create React components instead.
- ❌ Don't use inline styles; use Tailwind utilities exclusively.
- ❌ Don't create overly long class strings; extract to reusable components if needed.
- ❌ Don't use inconsistent spacing or colors; stick to the design system.
- ❌ Don't forget responsive breakpoints for mobile-first design.
- ❌ Don't ignore accessibility features (focus states, sufficient contrast, semantic HTML).

## Configuration
- Define custom colors, spacing, or other design tokens in `tailwind.config.ts`.
- Use consistent naming conventions for custom values.
- Document any custom configuration additions.

```typescript
// tailwind.config.ts example
import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... other shades
          900: '#1e3a8a',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## Best Practices Summary
1. **Mobile-first**: Always design for mobile devices first, then enhance for larger screens.
2. **Consistent spacing**: Use Tailwind's spacing scale; avoid arbitrary values.
3. **Semantic colors**: Use colors meaningfully (blue for primary, red for errors, etc.).
4. **Readable classes**: Organize utility classes logically (layout → spacing → colors → typography → effects).
5. **Component extraction**: Extract repeated utility patterns into React components.
6. **Accessibility**: Ensure keyboard navigation, focus states, and sufficient contrast.
7. **Performance**: Keep utility class lists reasonable; use conditional logic with `clsx`/`cn`.
8. **Touch-friendly**: Ensure interactive elements have minimum 44x44px tap targets.
9. **Transitions**: Add smooth transitions for interactive elements.
10. **Testing**: Test responsive behavior across different screen sizes and devices.
