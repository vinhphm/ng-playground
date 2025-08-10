# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Note: This project uses Bun as the package manager instead of npm.**

- **Start development server**: `ng serve` (runs on http://localhost:4200)
- **Build project**: `ng build` (outputs to `dist/` directory)
- **Run tests**: `ng test` (uses Karma test runner)
- **Watch build**: `ng build --watch --configuration development`
- **Generate components**: `ng generate component component-name`
- **Install dependencies**: `bun install`

## Project Architecture

This is an Angular 20 application implementing a **Refine-like** resource-based admin framework. The architecture follows a modular structure with automatic route generation based on resource configuration.

### Core Architecture

**Resource System**: The application uses a resource-based approach where entities (posts, users) are registered with their associated components:
- `ResourceService` (`src/app/core/services/resource.service.ts`) manages resource registration and retrieval
- `RefineRouterService` (`src/app/core/services/refine-router.service.ts`) automatically generates Angular routes from registered resources
- Resources support nested relationships and modal-based actions

**Path Aliases** (configured in `tsconfig.json`):
- `@app/*` → `src/app/*`
- `@core` → `src/app/core`
- `@features/*` → `src/app/features/*`
- `@shared/*` → `src/app/shared/*`

### Key Technologies

- **Angular 20** with standalone components
- **Ng-Zorro** (Ant Design for Angular) for UI components
- **TanStack Query** for data fetching and caching
- **TailwindCSS** for styling
- **TypeScript** with strict mode enabled

### Resource Registration Pattern

Resources are registered in `src/app/app.ts` with components for different actions:

```typescript
this.resourceService.register([
  {
    name: "posts",
    list: PostListContainerComponent,
    show: PostShowComponent,
    edit: PostEditRouteComponent,
    create: PostCreateRouteComponent,
    meta: {
      icon: "file-text",
      label: "Posts",
      createInModal: true,  // Opens in modal instead of separate route
      editInModal: true,
    },
  }
]);
```

### Component Structure

**Features are organized by domain** (`src/app/features/`):
- Each feature contains `components/` and `services/` directories
- Components follow a separation between container (data-fetching) and presentation components
- Modal-based actions use route-level components that handle the modal state

**Component Organization Rules**:
- **Single-file components**: Placed directly in `components/` directory (e.g., `post-create.component.ts`)
- **Multi-file components**: Have their own subdirectory when they include HTML, CSS, or multiple related files (e.g., `post-list/`, `post-show/`)
- **Container components**: Handle data fetching and business logic, typically single-file
- **Presentation components**: Handle UI rendering, often multi-file with templates and styles

**Layout System** (`src/app/shared/components/layout/`):
- `MainLayoutComponent` provides the overall application shell
- `SidebarComponent` automatically generates navigation from registered resources

### Route Generation

Routes are automatically generated based on resource configuration:
- Standard routes: `/{resource}`, `/{resource}/{id}`, `/{resource}/create`, `/{resource}/{id}/edit`
- Modal routes: Nested child routes that trigger modals instead of navigation
- Nested resources: `/{parent}/{parentId}/{child}` pattern support

## Testing Framework

Uses **Jasmine** with **Karma** test runner. Test files follow the `*.spec.ts` convention.

**Test Commands:**
- **Run tests**: `ng test`
- **Run tests with Bun**: `bun test`

## Code Quality & Linting

**Important**: Always run linting and formatting before committing:
- **Lint code**: `ultracite lint` (or `bun run lint`)
- **Format code**: `ultracite format` (or `bun run format`)
- **Type check**: `ng build` performs TypeScript type checking

**Linting Configuration:**
- Uses **Biome** via **Ultracite** for linting and formatting
- Configuration in `biome.jsonc`
- Extends Ultracite's base configuration
- Custom rules disabled for Angular-specific patterns

## Deployment

**Deployment to Cloudflare Pages:**
- **Deploy command**: `bun run deploy`
- **Build output**: `dist/ng-playground/browser`
- **Configuration**: `wrangler.jsonc`
- **SPA mode**: Configured for single-page application routing

**Manual Build:**
- **Development build**: `ng build`
- **Production build**: `ng build --configuration production`
- **Watch build**: `ng build --watch --configuration development`

## Git Workflow

This project follows a feature-branch workflow:
- **Main branch**: `main` (default branch for PRs)
- **Feature branches**: Create from `main` for new features
- **Current branch**: `pagination` (as noted in git status)