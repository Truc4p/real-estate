# Real Estate Website

A modern, professional real estate website built with Next.js 14, TypeScript, and cutting-edge web technologies. Search, discover, and explore properties with advanced filtering and interactive map features.

## Features

- 🏠 **Property Listings** - Browse thousands of properties for sale and rent
- 🔍 **Advanced Search** - Filter by location, price, property type, bedrooms, and more
- 🗺️ **Interactive Maps** - Explore properties on an interactive Mapbox map
- ❤️ **Favorites** - Save and track your favorite properties
- 👤 **User Accounts** - Sign up, sign in, and manage your listings
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Next.js 14 for optimal speed and SEO

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

## License

This project is licensed under the MIT License.

## Support

For support, email support@realestate.com or open an issue in the repository.
