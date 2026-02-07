# 🏡 HomeFinder Pro

**Your Smart Real Estate Search Companion**

HomeFinder Pro is a cutting-edge real estate platform designed to revolutionize how people discover their dream properties. Built with modern web technologies, it combines powerful search capabilities, interactive maps, real-time alerts, and comprehensive property insights to deliver an exceptional user experience for buyers, renters, and real estate professionals.

## ✨ Key Features

### 🔍 Smart Property Search
- **Advanced Filtering** - Search by location, price range, property type, bedrooms, bathrooms, and more
- **Saved Searches** - Save your search criteria and get notified of new matches
- **Price Alerts** - Receive instant notifications when properties match your budget
- **Recently Viewed** - Track properties you've explored with automatic history

### 🗺️ Interactive Map Experience
- **Mapbox Integration** - Explore properties on a beautiful, responsive map interface
- **Draw Custom Boundaries** - Define your ideal neighborhood with custom search areas
- **Cluster Visualization** - See property density at a glance with intelligent clustering
- **Real-time Updates** - Properties update dynamically as you pan and zoom

### 📊 Property Intelligence
- **Price History Charts** - Visualize pricing trends over time
- **Neighborhood Insights** - Access walk scores, transit scores, and local amenities
- **Market Comparisons** - Compare similar properties side-by-side
- **Financial Calculators** - Estimate mortgage payments, affordability, and ROI

### 🔔 Real-Time Alerts System
- **New Listings** - Be first to know when properties hit the market
- **Price Drops** - Get notified when prices are reduced
- **Status Changes** - Track when properties go pending or back on market
- **Custom Preferences** - Set your own alert frequency (instant, daily, weekly)

### ❤️ Personalization Features
- **Favorites Collection** - Save and organize properties you love
- **Property Comparison** - Compare up to 4 properties at once
- **Quick View Modal** - Preview property details without leaving the search page
- **User Dashboard** - Manage your listings, favorites, and alerts in one place

### 📱 Modern User Experience
- **Responsive Design** - Seamless experience on desktop, tablet, and mobile devices
- **Fast Loading** - Optimized performance with Next.js 14 App Router
- **SEO Optimized** - Better visibility in search engines
- **Accessible** - WCAG compliant design for all users

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Maps:** Mapbox GL JS
- **State Management:** React Query (TanStack Query)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Mapbox account (for map features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_URL` - Your application URL (http://localhost:3000 for development)
   - `NEXTAUTH_SECRET` - Random secret for NextAuth (generate with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_MAPBOX_TOKEN` - Your Mapbox access token

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Using PostgreSQL

1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE realestate;
   ```
3. Update the `DATABASE_URL` in your `.env` file
4. Run migrations:
   ```bash
   npx prisma db push
   ```

### Seed Sample Data (Optional)

To add sample properties for testing:
```bash
npx prisma db seed
```

## Project Structure

```
real-estate/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── properties/        # Property pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── properties/       # Property components
│   ├── search/           # Search components
│   └── map/              # Map components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── types/                # TypeScript types
│   └── index.ts          # Global types
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client

## Features Overview

### Property Search
- Search by location (city, state, zip code)
- Filter by price range, bedrooms, bathrooms
- Filter by property type (house, apartment, condo, etc.)
- Filter by listing type (for sale or rent)

### Property Details
- High-quality image galleries
- Detailed property information
- Interactive location map
- Contact property owner/agent
- Save to favorites

### User Features
- User registration and authentication
- Create and manage property listings
- Save favorite properties
- User dashboard

## API Endpoints

- `GET /api/properties` - Get all properties with optional filters
- `GET /api/properties/[id]` - Get single property by ID
- `POST /api/properties` - Create new property listing
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

## Configuration

### Mapbox Setup

1. Create a free account at [Mapbox](https://www.mapbox.com/)
2. Get your access token from the dashboard
3. Add to `.env`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
   ```

### Database Schema

The database includes:
- **Users** - User accounts with roles (Buyer, Seller, Agent, Admin)
- **Properties** - Property listings with details
- **Favorites** - User-saved properties
- **SavedSearches** - User-saved search filters

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Database Hosting

Consider using:
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL with additional features
- [Railway](https://railway.app) - Simple PostgreSQL hosting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## About HomeFinder Pro

HomeFinder Pro was built to address the challenges of modern property search by combining powerful technology with user-centric design. Whether you're a first-time homebuyer, seasoned investor, or real estate professional, HomeFinder Pro provides the tools and insights you need to make informed real estate decisions.

**Mission:** To make property discovery effortless, transparent, and empowering for everyone.

**Vision:** To become the most trusted and intelligent real estate platform, connecting people with their perfect properties through innovative technology.

## License

This project is licensed under the MIT License.

## Support

For support, questions, or feedback:
- 📧 Email: support@homefinderpro.com
- 🐛 Issues: Open an issue in the repository
- 💬 Discussions: Join our community discussions
