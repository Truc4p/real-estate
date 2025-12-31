#!/bin/bash

echo "🏠 Real Estate Website Setup"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "   - NEXT_PUBLIC_MAPBOX_TOKEN (from mapbox.com)"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Ask about database setup
echo ""
echo "🗄️  Database Setup"
read -p "Do you want to push the database schema now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    echo ""
    
    read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run seed
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Update your .env file with actual credentials"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
