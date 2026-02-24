# ProDetect: Advanced Compliance Platform

ProDetect is a comprehensive AI-native application designed for advanced fraud detection, Anti-Money Laundering (AML) compliance, and risk management, specifically built for African financial institutions.

## 🏗️ System Architecture

### Core Components

#### 1. Data Layer

- **Customer Management**: KYC/CDD data, risk profiles, PEP status
- **Transaction Processing**: Real-time transaction ingestion and storage
- **Alert Management**: Suspicious activity detection and tracking
- **Case Management**: Investigation workflows and resolution tracking
- **Rules Engine**: Configurable AML detection rules
- **Reporting**: STR/CTR generation and regulatory compliance
- **Audit Trail**: Immutable logging for compliance

#### 2. Business Logic Layer

- **Risk Scoring Engine**: Dynamic customer risk assessment
- **Transaction Monitoring**: Real-time suspicious activity detection
- **Rules Management**: No-code rule creation and deployment
- **Case Workflow**: Investigation assignment and tracking
- **Report Generation**: Automated regulatory reporting
- **Integration Services**: External system connectivity

#### 3. API Layer

- RESTful APIs for all core functionality
- Real-time transaction ingestion endpoints
- Webhook support for external integrations
- Secure authentication and authorization

#### 4. Frontend Layer

- **Dashboard**: Real-time monitoring and analytics
- **Case Management**: Investigation workflow interface
- **Rules Builder**: Visual rule creation interface
- **Reporting**: Compliance report generation and export
- **User Management**: Role-based access control

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ProDetect_FE_V2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.template .env
   # Edit .env with your configuration
   ```

4. **Set up the database**

   ```bash
   # Run the automated setup script
   ./scripts/setup-database.sh

   # Or manually set up PostgreSQL
   # See DATABASE_SETUP.md for detailed instructions
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:9002`

### Database Setup

The application uses **PostgreSQL** with a comprehensive schema designed for compliance and audit requirements. We've removed ArangoDB and fully migrated to PostgreSQL for better performance and reliability.

**Quick Setup:**

```bash
# Automated setup (recommended)
./scripts/setup-database.sh

# Manual setup
# See DATABASE_SETUP.md for detailed instructions
```

**Database Features:**

- ✅ **PostgreSQL 14+** with connection pooling
- ✅ **Comprehensive schema** for compliance requirements
- ✅ **Sample data** for testing and development
- ✅ **Automated setup** script for easy configuration
- ✅ **Performance optimized** with proper indexing

### Using Supabase (optional)

To connect the app to your **Supabase** project and use it for all data (full CRUD on customers, transactions, alerts):

1. Create a project at [supabase.com](https://supabase.com) and run the migrations in `supabase/migrations/` (e.g. `supabase db push` or run the SQL in the Supabase SQL editor).
2. In `.env`, set:
   - `NEXT_PUBLIC_SUPABASE_URL` – your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – anon/public key (for auth and client)
   - `SUPABASE_SERVICE_ROLE_KEY` – service role key (for server-side full CRUD; keep secret)
3. Restart the dev server. The app will use Supabase for all database operations when these are set.

Auth (sign-in/sign-up) already uses Supabase when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.

## 🔧 API Endpoints

### Core APIs

#### Customers

- `GET /api/customers` - List customers with filtering and pagination
- `POST /api/customers` - Create new customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Soft delete customer

#### Transactions

- `GET /api/transactions` - List transactions with filtering
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get transaction details
- `PUT /api/transactions/[id]/status` - Update transaction status

#### Alerts

- `GET /api/alerts` - List alerts with filtering
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/[id]/status` - Update alert status
- `PUT /api/alerts/[id]/assign` - Assign alert to user

#### Analytics

- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/transactions` - Transaction analytics
- `GET /api/analytics/alerts` - Alert analytics

## 🛡️ Security Features

### Authentication & Authorization

- Role-based access control (RBAC)
- JWT-based authentication
- Session management
- Two-factor authentication support

### Data Protection

- End-to-end encryption for sensitive data
- Row Level Security (RLS) in database
- Audit logging for all operations
- Data retention policies (5+ years)

### Compliance

- CBN baseline standard adherence
- Automated STR/CTR generation
- Immutable audit trails
- KYC/CDD verification workflows

## 🔗 Integration Points

### Core Banking Systems

- Real-time transaction feeds
- Customer data synchronization
- Account status updates

### External Services

- **Sanctions Screening**: OFAC, UN, EU sanctions lists
- **Watchlist APIs**: PEP and adverse media screening
- **Regulatory Reporting**: NFIU integration
- **Document Verification**: KYC document validation

### Notification Systems

- Email notifications
- SMS alerts
- Slack integration
- Webhook callbacks

## 🤖 AI/ML Features

### Behavioral Analytics

- Customer segmentation models
- Anomaly detection algorithms
- Pattern recognition for fraud detection
- Dynamic risk scoring

### Fuzzy Matching/ Sanctions Screening

- AI-powered name screening
- Contextual similarity matching
- False positive reduction
- Multi-language support

### Automated Workflows

- Smart case assignment
- Evidence collection automation
- Risk assessment automation
- Predictive analytics

## 📊 Compliance Features

### Regulatory Reporting

- Automated SAR/STR generation
- Regulatory submission workflows
- Compliance dashboard
- Audit trail maintenance

### Risk Management

- Real-time risk scoring
- Customer due diligence (CDD)
- Enhanced due diligence (EDD)
- Ongoing monitoring

### Case Management

- Investigation workflows
- Evidence management
- Collaborative case handling
- Resolution tracking

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── alerts/            # Alert-specific components
│   ├── compliance/        # Compliance components
│   └── behavioral-modeling/ # Analytics components
├── lib/                   # Utilities and services
│   ├── api/               # API service layer
│   ├── database/          # Database schema and connection
│   └── hooks/             # Custom React hooks
└── ai/                    # AI/ML integration
    └── flows/             # GenKit AI flows
```

### Key Technologies

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL, Redis
- **AI/ML**: Google GenKit, TensorFlow.js
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts, ApexCharts
- **Authentication**: NextAuth.js

### Database Schema

The application uses a comprehensive PostgreSQL schema with:

- Customer management tables
- Transaction processing tables
- Alert and case management
- Rules engine configuration
- Audit logging
- Behavioral model storage

## 🚀 Deployment

### Production Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application
5. Set up monitoring and logging

### Environment Variables

See `.env.example` for required configuration:

- Database connection
- API keys for external services
- Security configurations
- Notification service settings

## 📈 Monitoring & Analytics

### Performance Monitoring

- Real-time system metrics
- API response times
- Database performance
- Error tracking with Sentry

### Compliance Metrics

- Alert generation rates
- False positive tracking
- Investigation timelines
- Regulatory submission status

### Business Intelligence

- Customer risk distribution
- Transaction volume analytics
- Fraud detection effectiveness
- Compliance officer productivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:

- Create an issue in the repository
- Contact the development team
- Refer to the documentation