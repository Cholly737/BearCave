# Deepdene Bears Cricket Club App

## Overview

This is a full-stack web application for the Deepdene Bears Cricket Club, built with a React frontend, Express.js backend, and PostgreSQL database. The application provides club members with access to fixtures, events, news feed, team information, and club resources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router for client-side navigation
- **State Management**: TanStack Query for server state management
- **Authentication**: Firebase Auth with Google Sign-in and guest mode fallback
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API endpoints
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Mobile-First Design
- Responsive design optimized for mobile devices
- Bottom navigation for primary app sections
- Side menu for secondary features and user management
- Touch-friendly interface elements

## Key Components

### Database Schema
- **Users**: Authentication and profile data
- **Events**: Club events and activities
- **Teams**: Cricket teams and divisions
- **Fixtures**: Match schedules and results
- **Feed Items**: News and announcements
- **Sponsors**: Club sponsor information

### Authentication System
- Firebase Authentication with Google OAuth
- Guest mode for users without Google accounts
- Automatic user creation on first login
- Session persistence across browser sessions

### Data Management
- Drizzle ORM for type-safe database operations
- Database migrations handled via drizzle-kit
- In-memory storage fallback for development
- Sample data initialization on server startup

### External Integrations
- **PlayHQ API**: Cricket fixture data integration (planned)
- **Firebase**: Authentication services
- **Google Fonts**: Typography (Montserrat, Open Sans)
- **RemixIcon**: Icon library

## Data Flow

1. **Authentication Flow**:
   - User attempts to access app
   - Firebase Auth checks authentication status
   - If unauthenticated, shows auth overlay with Google sign-in or guest mode options
   - Successful authentication creates/updates user record in database

2. **Data Fetching**:
   - TanStack Query manages API calls with caching
   - React components use query hooks to fetch data
   - Loading states and error handling built into query system
   - 5-minute stale time for most cached data

3. **Navigation**:
   - React Router handles client-side routing
   - Bottom navigation for main sections (Home, Fixtures, Feed, Events, Links)
   - Side menu for secondary features and user profile

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM
- **firebase**: Authentication services
- **@tanstack/react-query**: Server state management
- **express**: Backend web framework
- **axios**: HTTP client

### UI Dependencies
- **@radix-ui/***: Headless UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon components

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **esbuild**: Production bundling

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Environment variables for configuration
- Replit integration for cloud development

### Production Build
- Vite builds frontend to `dist/public`
- esbuild bundles backend to `dist/index.js`
- Single process serves both static files and API
- PostgreSQL database hosted on Neon

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- Firebase configuration via environment variables
- PlayHQ API credentials (when implemented)
- NODE_ENV for environment detection

### Key Features
- Mobile-optimized cricket club management
- Real-time fixture updates
- Event management and registration
- Club news and announcements
- Sponsor showcase
- Member authentication
- Offline-capable guest mode
- BearCave design implementation with club logo integration

## Recent Changes (January 2025)

### BearCave Design Implementation
- ✅ Applied BearCave Figma design system across all pages
- ✅ Updated color scheme to dark navy headers (#2C3E50) with green accents (#28A745)
- ✅ Redesigned all pages (Home, Fixtures, Events, Feed, Links) with clean white card layout
- ✅ Implemented simplified bottom navigation replacing complex header menu
- ✅ Integrated club logo into homepage hero section and website favicon
- ✅ Added social media buttons on homepage
- ✅ Simplified Layout component to match clean BearCave design approach