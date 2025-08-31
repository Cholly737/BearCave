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

### Navigation System Enhancement (August 2025)
- ✅ Added comprehensive header navigation with "BearCave" title and hamburger menu
- ✅ Created sliding side menu with access to Club Policy, Registrations, Shop, Sponsors
- ✅ Enhanced bottom navigation with labeled icons for better usability
- ✅ Implemented smooth transitions and proper mobile-first navigation patterns
- ✅ Updated all page layouts to work with new navigation structure

### PlayHQ API Integration & Error Handling (August 2025)
- ✅ Enhanced PlayHQ API error handling with specific HTTP status code messages
- ✅ Added comprehensive error screens explaining API connection issues
- ✅ Implemented prominent error banners when API fails but fallback data available
- ✅ Added retry functionality and data source switching capabilities
- ✅ Graceful fallback to local fixtures when PlayHQ API returns 403 (invalid/expired credentials)

### Database Enhancements (August 2025)
- ✅ Added Deepdene Bears Winter XI team for Mamgain Shield competition
- ✅ Created 6 winter season fixtures with local opponents
- ✅ Updated sponsors page with proper data integration and BearCave styling
- ✅ Enhanced Feed icon visibility in bottom navigation

### Empty State Implementation (August 2025)
- ✅ Added professional empty states for Feed and Events pages
- ✅ Consistent "No [content] yet" messaging with helpful subtitles
- ✅ Hidden example items showing proper content formatting
- ✅ Clean, centered layouts with appropriate icons (document, calendar)
- ✅ Disabled sample event creation in database initialization

### Authentic Sponsor Logo Integration (August 2025)
- ✅ Successfully integrated authentic Knight FM logo from user-provided AVIF file
- ✅ Converted AVIF format to PNG using ImageMagick for web compatibility
- ✅ Applied official "kfm" branding with blue typography and blue-green circular design
- ✅ Integrated 11 additional authentic sponsor logos from AVIF files
- ✅ Applied logos for: CorePlus, GBL Property, Elgin, Angle House, XMG Media, Ramsay Surgical Centre, Bindara Group, Sustainable Tree Management, GA Fire, Winequip
- ✅ Implemented cache-busting mechanism for immediate logo display updates
- ✅ Enhanced sponsor image error handling with fallback support

### Sponsor Organization Enhancement (August 2025)
- ✅ Reorganized sponsors into clearly defined Gold, Silver, and Bronze sections
- ✅ Added distinctive icons and color coding for each sponsorship level (trophy, medal, award)
- ✅ Created tiered card layouts: large Gold, medium Silver, compact Bronze displays
- ✅ Applied proper visual hierarchy with section headers and appropriate spacing
- ✅ Updated "Become a Sponsor" section with enhanced sponsorship level descriptions
- ✅ All 12 sponsors now display authentic branding organized by partnership level