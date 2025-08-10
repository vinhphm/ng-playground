# ng-playground

An Angular 20 application implementing a resource-based admin framework with automatic route generation and modal-based CRUD operations.

## Tech Stack

- **Angular 20** with standalone components
- **Ng-Zorro** (Ant Design for Angular) for UI components
- **TanStack Query** for data fetching and caching  
- **TailwindCSS** for styling
- **Bun** as package manager
- **Biome** for linting and formatting
- **Jasmine + Karma** for testing

## Installation

**Note: This project uses Bun as the package manager.**

```bash
bun install
```

## Development

### Available Scripts

```bash
# Start development server
bun start
# or
ng serve

# Build project  
bun run build
# or
ng build

# Watch mode for development
bun run watch
# or  
ng build --watch --configuration development

# Run tests
bun test
# or
ng test

# Lint code
bun run lint
# or
ultracite lint

# Format code
bun run format
# or
ultracite format

# Deploy (builds and deploys to Cloudflare)
bun run deploy
```

The development server runs on `http://localhost:4200/` with automatic reload.

## Project Structure

```
src/app/
├── core/
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── navigation.service.ts
│   │   ├── refine-router.service.ts
│   │   └── resource.service.ts
│   └── types/
│       └── resource.types.ts
├── features/
│   ├── grouped-table/
│   ├── posts/
│   └── users/
├── shared/
│   └── components/
│       └── layout/
│           ├── main-layout/
│           └── sidebar/
├── app.config.ts
├── app.routes.ts
└── app.ts
```

## Architecture

This application uses a resource-based approach where entities (posts, users) are registered with their associated components. The `ResourceService` manages resource registration and the `RefineRouterService` automatically generates Angular routes.

Features are organized by domain in the `features/` directory, with components following a separation between container (data-fetching) and presentation components.

## Deployment

The project is configured for deployment to Cloudflare Pages using Wrangler. The built files from `dist/ng-playground/browser` are deployed as a single-page application.

## Documentation

For detailed development guidelines and architecture information, see [CLAUDE.md](./CLAUDE.md).
