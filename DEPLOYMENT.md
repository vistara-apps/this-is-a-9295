# Deployment Guide

This guide covers deploying Niche Navigator to production.

## Prerequisites

Before deploying, ensure you have:
- Supabase production project set up
- Stripe account configured
- OpenAI API key
- Domain name (optional but recommended)

## Environment Setup

### 1. Supabase Setup

1. **Create Production Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project for production
   - Note down the project URL and anon key

2. **Database Setup**
   ```sql
   -- Run these commands in Supabase SQL Editor
   
   -- Users table
   CREATE TABLE users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
     stripe_customer_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Ideas table
   CREATE TABLE ideas (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     problem_category TEXT NOT NULL,
     validation_stage TEXT DEFAULT 'initial' CHECK (validation_stage IN ('initial', 'testing', 'validated', 'rejected')),
     user_pain_points TEXT[] DEFAULT '{}',
     revenue_potential INTEGER DEFAULT 0,
     target_users INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Pain points table
   CREATE TABLE pain_points (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
     category TEXT NOT NULL,
     description TEXT NOT NULL,
     impact_score INTEGER DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 10),
     wtp_score INTEGER DEFAULT 0 CHECK (wtp_score >= 0 AND wtp_score <= 10),
     freq_score INTEGER DEFAULT 0 CHECK (freq_score >= 0 AND freq_score <= 10),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Validation signals table
   CREATE TABLE validation_signals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
     type TEXT NOT NULL CHECK (type IN ('survey', 'interview', 'landing_page', 'prototype', 'other')),
     result JSONB NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Enable Row Level Security**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
   ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
   ALTER TABLE validation_signals ENABLE ROW LEVEL SECURITY;

   -- Users policies
   CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

   -- Ideas policies
   CREATE POLICY "Users can view own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid() = user_id);

   -- Pain points policies
   CREATE POLICY "Users can view own pain points" ON pain_points FOR SELECT USING (
     EXISTS (SELECT 1 FROM ideas WHERE ideas.id = pain_points.idea_id AND ideas.user_id = auth.uid())
   );
   CREATE POLICY "Users can insert own pain points" ON pain_points FOR INSERT WITH CHECK (
     EXISTS (SELECT 1 FROM ideas WHERE ideas.id = pain_points.idea_id AND ideas.user_id = auth.uid())
   );

   -- Validation signals policies
   CREATE POLICY "Users can view own validation signals" ON validation_signals FOR SELECT USING (
     EXISTS (SELECT 1 FROM ideas WHERE ideas.id = validation_signals.idea_id AND ideas.user_id = auth.uid())
   );
   CREATE POLICY "Users can insert own validation signals" ON validation_signals FOR INSERT WITH CHECK (
     EXISTS (SELECT 1 FROM ideas WHERE ideas.id = validation_signals.idea_id AND ideas.user_id = auth.uid())
   );
   ```

### 2. Stripe Setup

1. **Create Stripe Account**
   - Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
   - Complete account verification

2. **Create Products and Prices**
   ```bash
   # Using Stripe CLI (optional)
   stripe products create --name="Niche Navigator Pro" --description="Pro subscription for Niche Navigator"
   stripe prices create --product=prod_xxx --unit-amount=1900 --currency=usd --recurring-interval=month
   ```

3. **Configure Webhooks**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_OPENAI_API_KEY
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_STRIPE_PUBLISHABLE_KEY
   ```

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all required variables

### Option 3: Custom Server

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Serve with nginx**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location / {
       root /path/to/dist;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

## Backend API Implementation

For full functionality, you need to implement backend endpoints:

### 1. Stripe Checkout Session
```javascript
// /api/create-checkout-session
export default async function handler(req, res) {
  const { userId, email, priceId, successUrl, cancelUrl } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId }
  });
  
  res.json({ sessionId: session.id });
}
```

### 2. Customer Portal Session
```javascript
// /api/create-portal-session
export default async function handler(req, res) {
  const { customerId, returnUrl } = req.body;
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
  res.json({ url: session.url });
}
```

### 3. Webhook Handler
```javascript
// /api/webhooks/stripe
export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Update user subscription status
      break;
    case 'customer.subscription.deleted':
      // Handle cancellation
      break;
    // Handle other events...
  }
  
  res.json({ received: true });
}
```

## Environment Variables

Set these in your deployment platform:

```env
VITE_OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test idea creation and management
- [ ] Test subscription upgrade flow
- [ ] Test data export functionality
- [ ] Verify Stripe webhooks are working
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate
- [ ] Test mobile responsiveness
- [ ] Verify all environment variables are set

## Monitoring and Maintenance

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### Performance Monitoring
- Monitor Core Web Vitals
- Set up uptime monitoring
- Monitor database performance in Supabase

### Backup Strategy
- Supabase handles database backups automatically
- Consider exporting user data periodically
- Keep environment variables backed up securely

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase URL and keys
   - Verify RLS policies are set up correctly

2. **Stripe payments failing**
   - Check webhook endpoint is accessible
   - Verify webhook secret is correct
   - Check Stripe keys are for the right environment

3. **Build failures**
   - Check all dependencies are installed
   - Verify environment variables are set
   - Check for TypeScript errors

### Support

For deployment issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test locally with production environment variables
4. Check Supabase and Stripe dashboards for errors
