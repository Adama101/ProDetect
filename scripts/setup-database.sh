#!/bin/bash

# ProDetect Database Setup Script
# This script helps set up the PostgreSQL database for the ProDetect application

echo "🚀 Setting up ProDetect PostgreSQL Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   Visit: https://www.postgresql.org/download/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one based on env.template"
    exit 1
fi

# Load environment variables
source .env

# Check if required environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "❌ Database environment variables not set in .env file"
    echo "   Please set DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD"
    exit 1
fi

echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: ${DB_PORT:-5432}"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"

# Test database connection
echo "🔌 Testing database connection..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d postgres -c "SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to database. Please check your credentials and ensure PostgreSQL is running."
    exit 1
fi

# Create database if it doesn't exist
echo "🗄️  Creating database if it doesn't exist..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE \"$DB_NAME\" WITH OWNER = \"$DB_USER\";" 2>/dev/null || echo "   Database already exists or creation failed"

# Run schema
echo "📋 Running database schema..."
if [ -f "src/lib/database/schema.sql" ]; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d "$DB_NAME" -f "src/lib/database/schema.sql"
    echo "✅ Database schema applied"
else
    echo "❌ Schema file not found: src/lib/database/schema.sql"
    exit 1
fi

# Run seed data
echo "🌱 Running seed data..."
if [ -f "src/lib/database/seed.sql" ]; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d "$DB_NAME" -f "src/lib/database/seed.sql"
    echo "✅ Seed data applied"
else
    echo "❌ Seed file not found: src/lib/database/seed.sql"
    exit 1
fi

echo "🎉 Database setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start your Next.js application: npm run dev"
echo "2. Test the database connection by visiting your app"
echo "3. Check the console for database connection messages"



