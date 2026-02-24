# ProDetect Database Setup Guide

This guide will help you set up the PostgreSQL database for the ProDetect application.

## Prerequisites

1. **PostgreSQL** installed and running on your system

   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Node.js** and **npm** installed
   - Download from: https://nodejs.org/

## Quick Setup

### 1. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp env.template .env
```

Edit `.env` with your actual values:

```bash
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prodetect
DB_USER=postgres
DB_PASSWORD=your_actual_password

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Tazama Configuration (if using)
TAZAMA_API_KEY=your_tazama_api_key
```

### 2. Automated Database Setup

Run the setup script:

```bash
./scripts/setup-database.sh
```

This script will:

- ✅ Check PostgreSQL installation
- ✅ Test database connection
- ✅ Create the database if it doesn't exist
- ✅ Apply the database schema
- ✅ Insert sample data

### 3. Manual Database Setup (Alternative)

If you prefer to set up manually:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE prodetect;

# Connect to the new database
\c prodetect

# Run schema (from psql)
\i src/lib/database/schema.sql

# Run seed data
\i src/lib/database/seed.sql

# Exit psql
\q
```

## Database Schema

The application uses the following main tables:

- **customers** - Customer information and risk assessment
- **transactions** - Financial transactions with risk scoring
- **alerts** - Generated alerts from rule evaluations
- **rules** - Business rules for transaction monitoring
- **rule_evaluations** - Results of rule evaluations
- **users** - Application users and authentication
- **audit_log** - Audit trail for compliance

## Testing the Setup

### 1. Start the Application

```bash
npm run dev
```

### 2. Check Database Connection

Look for this message in the console:

```
✅ Connected to PostgreSQL database
```

### 3. Test API Endpoints

Visit these endpoints to test the database:

- **Transactions**: `http://localhost:9002/api/transactions`
- **Customers**: `http://localhost:9002/api/customers`
- **Alerts**: `http://localhost:9002/api/alerts`

## Troubleshooting

### Common Issues

1. **Connection Refused**

   - Ensure PostgreSQL is running
   - Check if the port (5432) is correct
   - Verify firewall settings

2. **Authentication Failed**

   - Check username/password in `.env`
   - Ensure the user has proper permissions

3. **Database Not Found**

   - Run the setup script again
   - Check if the database name is correct

4. **Permission Denied**
   - Ensure the PostgreSQL user has CREATE and INSERT privileges
   - Check file permissions on schema and seed files

### Reset Database

To start fresh:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS prodetect;"
psql -U postgres -c "CREATE DATABASE prodetect;"

# Run setup again
./scripts/setup-database.sh
```

## Development Workflow

### Adding New Tables

1. Add the table definition to `src/lib/database/schema.sql`
2. Update the interfaces in `src/lib/database/postgresService.ts`
3. Add corresponding API endpoints
4. Test with sample data

### Database Migrations

For production use, consider using a migration tool like:

- **Prisma Migrate**
- **TypeORM Migrations**
- **Knex.js Migrations**

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Access**: Use least-privilege access for database users
3. **Connection Pooling**: The application uses connection pooling for better performance
4. **SQL Injection**: All queries use parameterized statements for security

## Performance Optimization

1. **Indexes**: The schema includes indexes on frequently queried columns
2. **Connection Pooling**: Configured with max 20 connections
3. **Query Optimization**: Use the provided service methods for consistent query patterns

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify your PostgreSQL installation
3. Ensure all environment variables are set correctly
4. Check the database logs for connection issues

## Next Steps

After successful database setup:

1. Configure Supabase (if using for authentication)
2. Set up Tazama integration (if using for rules engine)
3. Test the full application workflow
4. Customize business rules and monitoring parameters



