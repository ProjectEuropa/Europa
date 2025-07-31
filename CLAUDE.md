# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Europa is a full-stack web application for sharing, analyzing, and collaborating on OKE files for Carnage Heart EXA. The architecture consists of:

- **Backend**: Laravel 11.x (PHP 8.4) with Sanctum authentication, Filament admin panel
- **Frontend**: Next.js 15.x (React 19.x) with TypeScript, TailwindCSS, and shadcn/ui components
- **Database**: PostgreSQL with file storage capabilities
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## Development Commands

### Backend (Laravel)
```bash
# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database operations
php artisan migrate --seed

# Start development server
php artisan serve --host 0.0.0.0 --port 50756

# Run tests
./vendor/bin/phpunit
```

### Frontend (Next.js)
```bash
cd frontend

# Install dependencies
npm install

# Development server (runs on port 3002)
npm run dev

# Build and production
npm run build
npm run start

# Testing
npm run test              # Unit tests with Vitest
npm run test:coverage     # Coverage report
npm run test:e2e          # E2E tests with Playwright

# Code quality
npm run lint              # Biome linting
npm run format:fix        # Auto-format code
npm run check:fix         # Fix linting and formatting
```

## Architecture & Key Patterns

### API Structure
- **Legacy API**: Unversioned routes in `/api/` for backward compatibility
- **V1 API**: Versioned routes in `/api/v1/` with Sanctum authentication
- **Authentication**: Laravel Sanctum for SPA authentication with token-based auth
- **File Handling**: Specialized controllers for file operations and downloads

### Frontend Architecture
- **App Router**: Next.js 13+ app directory structure
- **State Management**: Zustand for global state, React Query for server state
- **API Client**: Type-safe API client with error handling (`src/lib/api/client.ts`)
- **Components**: shadcn/ui components with custom variants
- **Forms**: React Hook Form with Zod validation schemas

### Key Directories
- `app/`: Laravel backend logic (models, controllers, services)
- `frontend/src/app/`: Next.js app router pages
- `frontend/src/components/`: Reusable React components
- `frontend/src/lib/api/`: API client and endpoints
- `frontend/src/types/`: TypeScript type definitions
- `frontend/src/schemas/`: Zod validation schemas
- `routes/api.php`: API route definitions

### Database Models
- **User**: Authentication and authorization with Filament admin access
- **File**: Core file entity with downloadable_at field for timed access
- **Event**: Event management system

### Authentication Flow
1. Frontend sends credentials to `/api/v1/login`
2. Laravel returns Sanctum token
3. Token stored in localStorage for subsequent requests
4. API client automatically includes Bearer token in headers

### File System
- File uploads handled through specialized upload controllers
- Search functionality with keyword matching across multiple fields
- Download restrictions based on `downloadable_at` timestamp

## Testing Approach

### Unit Tests (Vitest)
- Component testing with React Testing Library
- API layer testing with MSW (Mock Service Worker)
- Hook testing for custom React hooks
- Schema validation testing

### E2E Tests (Playwright)
- Authentication flows
- Search functionality
- File upload/download workflows
- Cross-browser testing (Chromium, Firefox, WebKit)

## Code Quality Tools

- **Biome**: Linting and formatting (replaces ESLint/Prettier)
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run checks only on staged files

## Environment Configuration

### Backend (.env)
```
DB_CONNECTION=pgsql
DB_HOST=pg
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=password
```

### Frontend (environment variables)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_BASIC_AUTH_USER/PASSWORD`: Staging environment basic auth

## Docker Development

Use `docker-compose.server.yml` for containerized development:
```bash
docker compose -f docker-compose.server.yml up -d --build
docker compose -f docker-compose.server.yml run php-fpm composer install
docker compose -f docker-compose.server.yml run php-fpm php artisan migrate
```

## Security Considerations

- Sanctum tokens for API authentication
- Basic auth protection for staging environment  
- File access controlled by downloadable_at timestamps
- Admin panel access restricted by email configuration