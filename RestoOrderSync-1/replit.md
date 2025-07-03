# Restaurant Ordering System

## Overview

This is a full-stack restaurant ordering system built for Indonesian restaurants. The system provides a customer-facing ordering interface and an admin dashboard for managing orders and menu items. It's designed as a modern web application with a React frontend and Express.js backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful JSON API
- **Development Server**: Hot reloading with Vite integration

### Database Architecture
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Located in `shared/schema.ts` for frontend/backend sharing
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Database Schema
The system uses four main tables:
- **users**: Admin authentication (username/password)
- **menu_items**: Restaurant menu with categories, prices, and availability
- **orders**: Customer orders with status tracking and payment info
- **transactions**: Payment transaction records linked to orders

### API Endpoints
- **Menu Management**: CRUD operations for menu items with category filtering
- **Order Processing**: Order creation, status updates, and retrieval
- **Reporting**: Sales analytics and transaction history
- **User Management**: Basic admin user operations

### User Interface Components
- **Customer Interface**: Menu browsing, cart management, payment selection
- **Admin Dashboard**: Order management, menu editing, status updates
- **Reports**: Sales analytics and transaction reporting
- **Shared Components**: Reusable UI elements using shadcn/ui

## Data Flow

1. **Customer Orders**: Customers browse menu → add items to cart → select payment method → submit order
2. **Order Processing**: Orders appear in admin dashboard → admin confirms/rejects → status updates tracked
3. **Payment Flow**: Support for cash payments and QRIS (QR code) digital payments
4. **Reporting**: Transaction data aggregated for sales reports and analytics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **wouter**: Lightweight React router

### Development Tools
- **Vite**: Build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

## Deployment Strategy

### Development
- Runs on port 5000 with Vite dev server
- Hot reloading for both frontend and backend
- PostgreSQL database required via `DATABASE_URL` environment variable

### Production
- Frontend built to static assets in `dist/public`
- Backend bundled as single Node.js file in `dist/index.js`
- Autoscale deployment target configured for Replit hosting
- Database migrations handled via `npm run db:push`

### Environment Configuration
- Development: Uses Vite dev server with Express API proxy
- Production: Express serves static files and API routes
- Database: PostgreSQL connection required in all environments

## Changelog
- June 15, 2025. Initial setup
- June 15, 2025. Added customer table number input and separated customer/admin interfaces

## Recent Changes
- Added table number and customer name input modal in ordering flow
- Removed admin access link from customer interface for better separation
- Fixed modal accessibility warnings by adding DialogDescription components
- Enhanced admin dashboard with link to customer page
- Improved user experience with proper form validation for customer info

## User Preferences

Preferred communication style: Simple, everyday language.