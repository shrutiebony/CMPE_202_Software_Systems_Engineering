# Opentable
# BookTable Application

## Team Information
**Team Name**: Tech Trio

**Team Members**:
- [*Shruti Goyal*]
  - Areas of Contribution: Frontend UI/UX and Backend Implementations for all customers (Display a list of restaurants that have availability at the specified time, Cuisine type, Cost rating, Reviews and Ratings filter criteria, search functions, View Restaurant Reviews, booking a table, cancel booking, ), Frontend UI/UX and Backend Implementations Restaurant search functionality, , Frontend UI/UX and Backend Implementations for Admin Dashboard (Remove Restaurants, Approve new restaurants to be included, View Analytics Dashboard of Reservations for the last month)
- [*Aditya Rajpurohit*]
  - Areas of Contribution: Backend API implementation and Front-end API implementation for Restaurant Manager Dashboard (Add a new listing, Add/Update name, address, contact info, Hours, Available booking times, table sizes
, Add/update descriptions, Login as RestaurantManager), , Database design
- [*Mann Nada*]
  - Areas of Contribution: Authentication system (login, register), OAuth, Deployment configuration, Testing and quality assurance

## Project Overview
BookTable is an end-to-end restaurant reservation application similar to OpenTable. The application allows customers to search for restaurants and make reservations, restaurant managers to manage their listings, and administrators to oversee the platform.

## Links
- [Project Journal](https://docs.google.com/document/d/1EjQj-mZ5t8NCFZjNkJTsHAGpv7AYtcZtDGQ5yq53YWc/edit?usp=sharing)
- [Product & Sprint Backlog](https://docs.google.com/spreadsheets/d/1iD2uDq-CfOlZMXjbR0RR1-VTIMA1FaoHdvj7BhhbBGs/edit?usp=sharing)

## Feature Set

### Customer Features
- Search for restaurants by Date, Time, Party Size, and location (City/State or Zip code)
- View available restaurants with details (Name, Cuisine type, Cost rating, Reviews/Ratings, Booking counts)
- Select available time slots to book tables
- View restaurant reviews
- View restaurant locations on Google Maps
- User registration and authentication
- Book tables with email/SMS confirmation
- Cancel bookings

### Restaurant Manager Features
- Add new restaurant listings
- Manage restaurant details (name, address, contact info, hours, available booking times, table sizes)
- Update descriptions and photos
- Secure authentication system

### Admin Features
- Remove restaurants from the platform
- Approve new restaurant listings
- Access analytics dashboard for reservation data

## Project Structure







A quick overview of the folder structure of the `booktable-application`:

- **public/**  
  Static assets like the table icon.

- **src/**  
  Main source code for the application.
  
  - **components/**  
    Reusable UI components organized by feature.
    
    - **common/** – Generic UI components (Button, Card, Input, Modal)  
    - **layout/** – Structural UI elements (Header, Footer, Sidebar)  
    - **restaurant/** – Customer-facing restaurant features  
    - **admin/** – Admin dashboard components  
    - **manager/** – Manager tools like forms and calendars

  - **pages/**  
    Page-level React components corresponding to routes.
    
    - Home, SearchResults, RestaurantDetails, BookingConfirmation, UserProfile  
    - **auth/** – Login and Register pages  
    - **manager/** – Manager dashboard, restaurant editing, and reservations  
    - **admin/** – Admin dashboard, restaurant approval, analytics

  - **hooks/**  
    Custom React hooks (authentication, restaurant data, reservations)

  - **store/**  
    Zustand stores for managing app state

  - **services/**  
    API and business logic layer

  - **utils/**  
    Utility functions (dates, validation, formatting)

  - **types/**  
    TypeScript interfaces and types

  - **constants/**  
    App-wide constants like routes and API paths

  - **assets/**  
    Static assets like images or fonts

  - **App.tsx** – Main React component  
  - **main.tsx** – App entry point  
  - **supabase.ts** – Supabase client configuration

- **.eslintrc.config.js** – Linting config  
- **index.html** – Base HTML file  
- **package.json** – Project metadata and dependencies  
- **tailwind.config.js** – Tailwind CSS config  
- **tsconfig.json** – TypeScript configuration  
- **vite.config.ts** – Vite bundler config  
- **README.md** – This file










## Architecture & Design

### Technology Stack
- **Frontend**: 
  - React 18.3.1 with TypeScript
  - React Router 6.30.0 for routing
  - Zustand 4.5.6 for state management
  - TailwindCSS 3.4.13 for styling
  - Lucide React for icons
  - Date-fns for date manipulation
- **Backend**: 
  - Supabase for authentication, database and storage
- **Database**: 
  - PostgreSQL (via Supabase)
- **Deployment**: 
  - AWS EC2 Auto-Scaled Cluster with Load Balancer

### Architecture Diagrams
- Component Diagram: # BookTable Component Architecture
This component diagram illustrates the architecture of our BookTable reservation application. The frontend leverages React 18 with TypeScript, Vite, and Tailwind CSS for the UI layer, with Zustand managing state and React Router handling navigation. The backend utilizes Supabase for authentication, database, and storage, while the deployment infrastructure runs on AWS with auto-scaling EC2 instances, S3 for static assets, and CloudFront CDN.
![image](https://github.com/user-attachments/assets/a4d066fe-8715-418f-a488-02d7de417112)

- Deployment Diagram: # Our BookTable application employs a robust AWS cloud infrastructure with Route 53 for DNS and CloudFront for content delivery, directing traffic to an Elastic Load Balancer that distributes requests across auto-scaling EC2 instances running our React frontend. Backend services are managed through Supabase Cloud, providing authentication, PostgreSQL database, file storage, and serverless edge functions. This architecture ensures high availability and performance through redundant systems, while CloudWatch monitoring provides real-time system health metrics. The separation of frontend and backend concerns allows independent scaling and maintenance, creating a resilient system that can handle varying loads from customers, restaurant managers, and administrators. 
![image](https://github.com/user-attachments/assets/6ba160ef-5058-4a5b-91a4-5f227eb8a262)


### UI Wireframes
https://docs.google.com/document/d/1WtPXpdIT1JBMynCHtMv6XWKkus6AUzFtP7DfvX0yfrE/edit?usp=sharing

## XP Core Values
Our team embraced the following XP Core Values throughout the project:

### Communication
Throughout our project, our team maintained open communication channels via regular daily stand-ups and a dedicated Slack channel. We ensured everyone was informed about project status, blockers, and decisions. We used pair programming for complex features, which enhanced knowledge sharing and code quality. Our communication strategy was transparent, with team members feeling comfortable raising concerns and proposing solutions, fostering a collaborative environment where ideas flowed freely.

### Respect
Our team prioritized mutual respect by acknowledging each member's unique skills and perspectives. During code reviews, feedback was constructive and focused on improving the product rather than criticizing individuals. We respected each other's time by being punctual for meetings and adhering to agreed deadlines. When disagreements arose, we practiced active listening and ensured everyone had equal opportunity to express their views. This respect extended to respecting the codebase through adherence to clean code practices and established standards.

## Installation and Setup
```bash
# Clone the repository
git clone https://github.com/your-username/booktable-application.git

# Navigate to the project directory
cd booktable-application

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Documentation
The application uses Supabase as the backend, with the following main API endpoints:

- Authentication
  - `/auth/signup` - Register a new user
  - `/auth/signin` - Sign in existing user
  - `/auth/signout` - Sign out user

- Restaurants
  - `/restaurants` - Get all restaurants
  - `/restaurants/:id` - Get restaurant by id
  - `/restaurants/search` - Search restaurants with filters
  - `/restaurants/:id/availability` - Get availability for a restaurant

- Reservations
  - `/reservations` - Create a new reservation
  - `/reservations/:id` - Get, update, or cancel a reservation
  - `/reservations/user/:userId` - Get all reservations for a user

- Admin
  - `/admin/restaurants/pending` - Get pending restaurant approvals
  - `/admin/restaurants/:id/approve` - Approve a restaurant
  - `/admin/analytics` - Get reservation analytics

