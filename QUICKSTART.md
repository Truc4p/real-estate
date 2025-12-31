# 🚀 Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL database ready (local or cloud)
- [ ] Mapbox account (optional, for maps)

## Setup Steps

### 1. Configure Environment Variables

Edit the `.env` file with your actual values:

```bash
# Your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/realestate"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Get from https://www.mapbox.com/
NEXT_PUBLIC_MAPBOX_TOKEN="pk.your-mapbox-token"
```

**💡 Tip:** For local development, you can use a simplified DATABASE_URL:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/realestate"
```

### 2. Set Up Database

Push the schema to your database:
```bash
npm run db:push
```

### 3. (Optional) Add Sample Data

Seed the database with demo properties:
```bash
npm run db:seed
```

This creates:
- 1 demo user (email: `demo@example.com`, password: `password123`)
- 5 sample properties in California

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

## Database Options

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb realestate
```

### Option 2: Cloud Database (Recommended)

**Neon (Free tier):**
1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `.env`

**Supabase (Free tier):**
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database

**Railway:**
1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string

## Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running
- Check your DATABASE_URL is correct
- For local DB: ensure you created the database

### "Invalid token" for maps
- Maps are optional for initial testing
- Get free token at [mapbox.com](https://www.mapbox.com/)
- Add to `.env` as `NEXT_PUBLIC_MAPBOX_TOKEN`

### Build errors
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

## What's Included

✅ **Home Page** - Hero section with search and featured properties  
✅ **Property Listings** - Grid view with advanced filters  
✅ **Property Cards** - Beautiful cards with images and details  
✅ **Search & Filters** - Location, price, bedrooms, type filters  
✅ **API Routes** - RESTful endpoints for properties  
✅ **Database Schema** - Users, Properties, Favorites, Saved Searches  
✅ **Responsive Design** - Mobile-friendly navigation and layout  

## Next Steps

1. **Customize the design** - Edit colors in [tailwind.config.js](tailwind.config.js)
2. **Add authentication** - Implement NextAuth.js signup/signin
3. **Enable maps** - Add Mapbox token for interactive maps
4. **Add more features:**
   - Property detail pages
   - User dashboard
   - Image upload
   - Email notifications
   - Reviews and ratings

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)

Need help? Check [README.md](README.md) for detailed documentation.
