# Niche Navigator

Discover and validate your next micro-SaaS idea with market demand.

## Overview

Niche Navigator is a comprehensive platform for founders to identify niche problems and quickly validate their revenue potential before building. The application provides AI-powered insights, validation tools, and strategic guidance for micro-SaaS development.

## Features

### Core Features
- **Problem Discovery Engine**: AI-powered tool that scans industry trends and community discussions to surface underserved problems
- **Rapid Validation Prompts**: Generate targeted questions and survey templates for market validation
- **Monetization Strategy Builder**: Frameworks and insights for lean pricing and packaging strategies
- **Guerilla Acquisition Planner**: Targeted outreach strategies to acquire first 10-50 paying customers

### Authentication & User Management
- Secure user authentication with Supabase
- User profiles and session management
- Password reset functionality

### Subscription Management
- Free tier with basic features (3 ideas, basic validation tools)
- Pro tier with advanced features ($19/month)
- Stripe integration for payment processing
- Feature gating based on subscription status

### Data Management
- Persistent storage with Supabase PostgreSQL
- Ideas management with CRUD operations
- Validation signals tracking
- Pain points analysis
- Data export (CSV/JSON) for Pro users

## Tech Stack

- **Frontend**: React 18.2.0, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Payments**: Stripe
- **AI**: OpenAI API
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `subscription_status` (Text: 'free' | 'pro')
- `stripe_customer_id` (Text)
- `created_at`, `updated_at` (Timestamps)

### Ideas Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name`, `description` (Text)
- `problem_category` (Text)
- `validation_stage` (Text: 'initial' | 'testing' | 'validated' | 'rejected')
- `user_pain_points` (Text Array)
- `revenue_potential`, `target_users` (Integer)
- `created_at`, `updated_at` (Timestamps)

### Pain Points Table
- `id` (UUID, Primary Key)
- `idea_id` (UUID, Foreign Key)
- `category`, `description` (Text)
- `impact_score`, `wtp_score`, `freq_score` (Integer 0-10)
- `created_at` (Timestamp)

### Validation Signals Table
- `id` (UUID, Primary Key)
- `idea_id` (UUID, Foreign Key)
- `type` (Text: 'survey' | 'interview' | 'landing_page' | 'prototype' | 'other')
- `result` (JSONB)
- `timestamp` (Timestamp)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd niche-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL commands from `src/lib/supabase.js` to create tables
   - Enable Row Level Security (RLS) policies as documented

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI-powered features | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── subscription/    # Subscription management
│   └── ...              # Feature components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # External service configurations
├── services/            # API services and utilities
├── utils/               # Utility functions
└── App.jsx              # Main application component
```

## Key Components

### Authentication System
- `AuthProvider`: Context provider for authentication state
- `AuthModal`: Login/signup/password reset modal
- `ProtectedRoute`: Route protection component
- `useAuth`: Authentication hook

### Subscription System
- `useSubscription`: Subscription management hook
- `PricingPage`: Pricing and feature comparison
- `stripeService`: Stripe integration utilities

### Data Management
- `useIdeas`: Ideas CRUD operations
- `useValidation`: Validation tools and tracking
- `ideaService`: Data export and search utilities

## Features by Plan

### Free Plan
- Up to 3 ideas
- Basic validation tools
- Community support
- Basic analytics

### Pro Plan ($19/month)
- Unlimited ideas
- Advanced validation tools
- Curated niche lists
- Data export (CSV/JSON)
- Advanced analytics
- Priority support

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- Uses Tailwind CSS for styling
- Custom design system with CSS variables
- Responsive design with mobile-first approach
- Component-based architecture

## Deployment

### Production Setup
1. Set up production Supabase project
2. Configure Stripe webhooks for subscription management
3. Set production environment variables
4. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

### Backend Requirements
For full functionality, you'll need to implement:
- Stripe webhook handlers for subscription events
- API endpoints for Stripe Checkout and Customer Portal
- Email notifications for subscription changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact support (Pro users get priority support)
