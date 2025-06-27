# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is a modified version of the Web Speed Hackathon 2024 project, featuring a fictional manga website called "Cyber TOON". The goal is to optimize the website's performance while adhering to specific regulations.

## Common Commands

### Setup and Installation

```bash
# Enable pnpm package manager
corepack enable pnpm
corepack use pnpm@latest

# Install dependencies
pnpm install

# Install Playwright (for testing)
pnpm --filter "@wsh-2024/testing" exec playwright install chromium
```

### Development Commands

```bash
# Build the application (server, app, admin)
pnpm run build

# Start the server
pnpm run start

# Format code
pnpm run format

# Lint code
pnpm run lint
pnpm run lint:eslint
pnpm run lint:prettier
pnpm run lint:tsc

# Run E2E tests and Visual Regression Tests
pnpm run test

# Run E2E tests in debug mode
pnpm run test:debug

# Run E2E tests against a remote environment
E2E_BASE_URL=https://example.com pnpm run test
```

## Project Architecture

### Workspace Structure

The project uses pnpm workspaces with the following components:

1. `/workspaces/server` - Server implementation using Hono.js
2. `/workspaces/client` - Browser entry files for both app and admin
3. `/workspaces/app` - Main Cyber TOON web application (React)
4. `/workspaces/admin` - Admin panel for Cyber TOON (React)
5. `/workspaces/schema` - Database models and API interfaces
6. `/workspaces/image-encrypt` - Code for image obfuscation
7. `/workspaces/testing` - E2E tests and visual regression testing

### Technologies Used

- **Frontend**: React, React Router, SWR for data fetching
- **Backend**: Node.js with Hono server
- **Database**: SQLite with Drizzle ORM
- **Testing**: Playwright for E2E and visual regression testing
- **Build Tools**: TypeScript, tsup for bundling

### Key Application Features

1. **Main Website**: A manga browsing and reading platform with:
   - Home page with featured manga, rankings, and daily updates
   - Author detail pages
   - Book detail pages
   - Episode pages with manga viewer
   - Search functionality

2. **Admin Panel**: Interface for managing content:
   - Author management
   - Book management
   - Episode management with image uploads
   - Release management

3. **Special Components**:
   - Service Worker: Handles JPEG XL image transformation (Chrome doesn't support JPEG XL natively)
   - Image Encryption: Manga images are obfuscated to prevent direct viewing

## Performance Considerations

The performance is evaluated using Lighthouse with focus on:
- First Contentful Paint
- Speed Index
- Largest Contentful Paint
- Total Blocking Time
- Cumulative Layout Shift
- Interaction to Next Paint

## Regulation Requirements

When making changes to the codebase, ensure:
1. No significant feature loss or design differences in Chrome
2. E2E tests and visual regression tests must pass
3. Database initialization API must work correctly
4. Service Worker must be registered
5. Manga images must remain obfuscated

## Special Notes

1. Access the main application at `http://localhost:8000/`
2. Access the admin panel at `http://localhost:8000/admin`
   - Username: `administrator@example.com`
   - Password: `pa5sW0rd!`
3. API documentation is available at `http://localhost:8000/api/v1`