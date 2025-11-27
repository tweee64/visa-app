# FEAT-001: Landing Page with Navigation and Hero Section

## Feature Overview

Create a comprehensive landing page for the Vietnam visa application service that allows users to navigate the main features and initiate the visa application process. The primary user role is prospective visa applicants who want to learn about and start their visa application.

## Component Analysis & Reuse Strategy

### Existing Components Assessment
Currently, the project contains minimal components:

- **`src/app/_components/post.tsx`** - Existing demo component; not relevant for this feature
- **`src/app/layout.tsx`** - Root layout; needs modification for global navigation
- **`src/app/page.tsx`** - Current homepage; needs complete replacement

### New Components Required
All components for this feature need to be created from scratch as there are no existing UI components that can be reused.

## Affected Files

- `[MODIFY] src/app/layout.tsx` - Update metadata for Vietnam visa application
- `[MODIFY] src/app/page.tsx` - Replace with landing page implementation
- `[CREATE] src/components/layout/Navigation.tsx` - Top navigation bar component
- `[CREATE] src/components/layout/Navigation.test.tsx` - Navigation component tests
- `[CREATE] src/components/layout/Navigation.visual.spec.ts` - Navigation visual tests
- `[CREATE] src/components/features/landing/HeroSection.tsx` - Hero banner with CTA
- `[CREATE] src/components/features/landing/HeroSection.test.tsx` - Hero section component tests
- `[CREATE] src/components/features/landing/HeroSection.visual.spec.ts` - Hero section visual tests
- `[CREATE] src/components/ui/Button.tsx` - Reusable button component
- `[CREATE] src/components/ui/Button.test.tsx` - Button component tests
- `[CREATE] src/components/ui/Button.visual.spec.ts` - Button visual tests
- `[CREATE] src/types/index.ts` - TypeScript type definitions
- `[CREATE] src/app/apply/page.tsx` - Placeholder apply visa page
- `[CREATE] src/app/services/page.tsx` - Placeholder services page
- `[CREATE] src/app/pricing/page.tsx` - Placeholder pricing page
- `[CREATE] src/app/about/page.tsx` - Placeholder about page
- `[CREATE] src/app/faqs/page.tsx` - Placeholder FAQs page
- `[CREATE] src/app/contact/page.tsx` - Placeholder contact page


## Component Breakdown

### Navigation Component (Client Component)
- **Name**: `Navigation`
- **Location**: `src/components/layout/Navigation.tsx`
- **Type**: Client Component (requires state for mobile menu toggle)
- **Responsibility**: Render responsive top navigation with menu items and authentication links
- **Key Props**:
  ```typescript
  interface NavigationProps {
    currentPath?: string;
  }
  ```
- **Child Components**: None

### HeroSection Component (Server Component)
- **Name**: `HeroSection`
- **Location**: `src/components/features/landing/HeroSection.tsx`
- **Type**: Server Component (static content, no interactivity)
- **Responsibility**: Display main hero banner with heading and CTA button
- **Key Props**: None (static content)
- **Child Components**: `Button`

### Button Component (Client Component)
- **Name**: `Button`
- **Location**: `src/components/ui/Button.tsx`
- **Type**: Client Component (handles click events)
- **Responsibility**: Reusable button with variants and states
- **Key Props**:
  ```typescript
  interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  }
  ```
- **Child Components**: None



## Design Specifications

### Color Analysis Table
| Design Color | Semantic Purpose | Element | Implementation Method |
|--------------|-----------------|---------|------------------------|
| #ffffff | Background primary | Page background, cards | Direct hex value (#ffffff) |
| #f8fafc | Background subtle | Navigation background | Direct hex value (#f8fafc) |
| #1e293b | Text primary | Main headings, navigation links | Direct hex value (#1e293b) |
| #64748b | Text secondary | Subtext, descriptions | Direct hex value (#64748b) |
| #3b82f6 | Primary brand | CTA buttons, links | Direct hex value (#3b82f6) |
| #1d4ed8 | Primary hover | Button hover states | Direct hex value (#1d4ed8) |
| #ef4444 | Error/danger | Error states, validation | Direct hex value (#ef4444) |
| #10b981 | Success | Success states | Direct hex value (#10b981) |
| #e2e8f0 | Border subtle | Form inputs, card borders | Direct hex value (#e2e8f0) |
| #cbd5e1 | Border | Dividers, inactive borders | Direct hex value (#cbd5e1) |

### Spacing System
- Container padding: 16px (mobile), 24px (tablet), 32px (desktop)
- Section gaps: 48px (mobile), 64px (tablet), 80px (desktop)
- Component gaps: 16px (small), 24px (medium), 32px (large)
- Button padding: 12px 24px (small), 16px 32px (medium), 20px 40px (large)

### Visual Hierarchy Diagram
```
Page Container
├── Navigation (sticky top)
│   ├── Logo/Brand
│   └── Menu Items (horizontal on desktop, hamburger on mobile)
└── Main Content
    └── Hero Section
        ├── Heading (h1)
        ├── Subheading (p)
        └── CTA Button (primary, large)
```

### Typography Details
- **Heading 1 (Hero)**: 48px/56px (mobile), 64px/72px (tablet), 80px/88px (desktop), font-weight: 800
- **Navigation Links**: 16px/24px, font-weight: 500
- **Body Text**: 18px/28px (mobile), 20px/32px (desktop), font-weight: 400
- **Button Text**: 16px/24px, font-weight: 600
- **Form Labels**: 14px/20px, font-weight: 500

### Responsive Breakpoints
- Mobile: < 640px (single column, stacked navigation)
- Tablet: 640px - 1024px (adjusted spacing, partial menu)
- Desktop: 1024px+ (full horizontal navigation, optimized spacing)

### Visual Verification Checklist
- [ ] Navigation bar maintains consistent height across viewports
- [ ] Logo/brand displays prominently on the left
- [ ] Navigation links are properly spaced and accessible
- [ ] Hero heading displays with proper line height and spacing
- [ ] CTA button uses primary color and proper padding
- [ ] Order status form is visually distinct but not overwhelming
- [ ] All touch targets meet 44x44px minimum requirement
- [ ] Responsive behavior works smoothly across breakpoints

## Data Flow & State Management

### TypeScript Types
Location: `src/types/index.ts`

```typescript
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}
```

### State Management Strategy
- **Navigation State**: Use `useState` for mobile menu toggle in `Navigation`
- **No Global State**: Current feature doesn't require Zustand or other global state management

### Data Fetching Strategy
- **Static Content**: Landing page uses static content with no external data fetching required

## API Endpoints & Contracts

### Current Requirements
The landing page currently requires no API endpoints as it consists entirely of static content. Future phases will add API integration for:
- Contact forms submission
- Newsletter signup functionality

### Planned Domain Models
Core database models to consider for future implementation:
- **User**: User accounts and profiles
- **Application**: Visa application submissions and status tracking

## Styling

### Tailwind Implementation Strategy
- Mobile-first responsive design using `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints
- Utility-first approach with consistent spacing scale (4, 8, 12, 16, 24, 32, etc.)
- Color implementation: Extend Tailwind's theme with custom brand colors for better maintainability
- Typography using Tailwind's scale: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- Component-specific styling with proper hover and focus states

### Brand Assets Strategy
- Logo/Brand: Create placeholder SVG logo or source from free logo resources
- Images: Use placeholder images or royalty-free images for hero section

### Key Styling Patterns
- **Navigation**: Sticky positioning, subtle background, clean typography
- **Hero Section**: Large typography, generous whitespace, centered layout
- **Buttons**: Consistent padding, rounded corners, smooth transitions
- **Forms**: Clean inputs, proper labels, validation states

### Visual Implementation Checklist
- [ ] All colors match the established palette exactly
- [ ] Spacing follows the 4px grid system consistently
- [ ] Typography hierarchy is properly implemented
- [ ] Interactive elements have appropriate hover/focus states
- [ ] Mobile navigation transforms correctly at breakpoints
- [ ] Touch targets meet accessibility requirements

## Testing Strategy

### Testing Approach Decision
For this visa application system, comprehensive testing is **essential** due to:
- Critical user workflows (visa applications, document uploads, payments)
- Regulatory compliance requirements
- Complex form validation and multi-step processes
- Integration with external services (payment gateways, government APIs)

### Unit Tests
- **Navigation Component**: Menu item rendering, mobile toggle functionality
- **Button Component**: Variant rendering, click handlers, disabled states
- **HeroSection Component**: Static content rendering, CTA button integration
- **Test Locations**: Co-located with components (`*.test.tsx`)

### Component Tests
- **Integration**: Navigation with routing, form with validation
- **Accessibility**: Screen reader compatibility, keyboard navigation
- **Responsive**: Behavior across different viewport sizes

### Visual Testing (Playwright)
- **Navigation Visual Test**: `src/components/layout/Navigation.visual.spec.ts`
- **Hero Section Visual Test**: `src/components/features/landing/HeroSection.visual.spec.ts`
- **Button Visual Test**: `src/components/ui/Button.visual.spec.ts`

### E2E Testing
- Critical user flow: Navigate to apply page from CTA button
- Navigation functionality across all menu items
- Future: Complete visa application submission workflow

## Accessibility (A11y) Considerations

- **Navigation**: Proper ARIA labels for mobile menu toggle, semantic nav element
- **Hero Section**: Proper heading hierarchy (h1 for main heading)
- **Buttons**: Descriptive text, proper focus indicators
- **Keyboard Navigation**: Full functionality without mouse interaction
- **Color Contrast**: Ensure 4.5:1 ratio for normal text, 3:1 for large text
- **Screen Reader**: Meaningful alt text, skip links for main content
- **Brand Assets**: Provide appropriate alt text for logo and hero images

## Security Considerations

- **XSS Prevention**: Properly escape any dynamic content in components
- **Navigation Security**: Ensure all navigation links are validated and safe
- **Static Content**: Current implementation uses static content with minimal security surface area

## Implementation Steps

**Status: ⬜ NOT STARTED**

**Phase 1: UI Implementation with Mock Data**

**1. Setup & Configuration:**
- [ ] Define types in `src/types/index.ts`
- [ ] Create components directory structure
- [ ] Update project metadata in `src/app/layout.tsx`

**2. Core UI Components:**
- [ ] Create `Button` component in `src/components/ui/Button.tsx`
- [ ] Implement button variants (primary, secondary, outline) with proper styling
- [ ] Add responsive sizing and accessibility attributes
- [ ] Apply direct hex values from color palette for button styles
- [ ] Create `Navigation` component in `src/components/layout/Navigation.tsx`
- [ ] Implement responsive navigation with mobile hamburger menu
- [ ] Add navigation items (services, pricing, about, faqs, contact)
- [ ] Apply consistent spacing and typography per design system

**3. Landing Page Components:**
- [ ] Create `HeroSection` component in `src/components/features/landing/HeroSection.tsx`
- [ ] Implement hero heading with proper typography hierarchy
- [ ] Add CTA button integration with `Button` component
- [ ] Apply hero-specific styling with generous whitespace

**4. Page Integration:**
- [ ] Replace content in `src/app/page.tsx` with new landing page
- [ ] Integrate `Navigation` component into layout
- [ ] Integrate `HeroSection` component into homepage
- [ ] Create placeholder pages for navigation links (services, pricing, about, faqs, contact)
- [ ] Set up Tailwind config with custom brand colors for better maintainability
- [ ] Create or source placeholder logo and hero images
- [ ] Test navigation between pages

**5. Styling Implementation:**
- [ ] Verify all colors match design palette EXACTLY using direct hex values
- [ ] Verify all spacing values follow 4px grid system EXACTLY
- [ ] Verify typography matches established hierarchy EXACTLY
- [ ] Apply mobile-first responsive design with proper breakpoints
- [ ] Implement hover and focus states for interactive elements
- [ ] Add smooth transitions for enhanced user experience
- [ ] Test responsive behavior across all viewport sizes

**6. Component Testing & Visual Validation:**
- [ ] Write unit tests for `Button` component with all variants and states
- [ ] Write unit tests for `Navigation` component with mobile toggle functionality
- [ ] Write unit tests for `HeroSection` component with static content validation
- [ ] Create Playwright visual test for `Navigation` component across viewports
- [ ] Add color verification tests with exact RGB values using CSS property assertions
- [ ] Add spacing verification tests with pixel measurements using DOM properties
- [ ] Add typography verification tests using computed styles
- [ ] Create Playwright visual test for `HeroSection` component across viewports
- [ ] Create Playwright visual test for `Button` component with all variants
- [ ] Add comprehensive `data-testid` attributes to all interactive elements
- [ ] Manual accessibility testing with keyboard navigation and screen readers

**Phase 2: Final Polish & Documentation**

**7. Final Polish & Documentation:**
- [ ] Add JSDoc documentation to all components and functions
- [ ] Performance optimization: lazy load non-critical components if needed
- [ ] SEO optimization: proper meta tags and structured data
- [ ] Final accessibility audit with automated tools
- [ ] Cross-browser compatibility testing
- [ ] Mobile device testing on actual hardware
- [ ] Performance testing and optimization

## References

- **Design System**: Project's established color palette and spacing system
- **Navigation Patterns**: Standard web navigation best practices
- **Form Design**: Accessibility-first form design principles
- **T3 Stack Documentation**: Next.js App Router, tRPC, and Prisma integration patterns
- **Tailwind CSS**: Utility-first CSS framework for responsive design