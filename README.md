# Vibe Check - Farcaster Matching App

A production-ready Farcaster matching miniapp where builders and creators connect. Users swipe on profiles, match based on vibe/skills, and receive notifications for profile views and connections.

## Tech Stack

- **Framework**: Next.js 14+ (App Router), TypeScript, TailwindCSS
- **Auth**: Sign In With Farcaster (SIWF) via Neynar
- **Storage**: Supabase (PostgreSQL + Auth)
- **Notifications**: Farcaster notifications system (webhook-based)
- **Deployment**: Vercel
- **APIs**: Neynar SDK for Farcaster data

## Features

1. **Authentication**: Sign In With Farcaster using Neynar's SIWN
2. **Profile Creation**: Create profiles with bio, space selection, tags, and skills
3. **Swipe Mechanism**: Swipe through profiles with daily limits
4. **Matching System**: Match when both users swipe yes
5. **Notifications**: Farcaster-native notifications via webhooks
6. **Matches Page**: View and message your matches

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_client_id
NEYNAR_API_KEY=your_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
JWT_SECRET=your_jwt_secret
```

3. Set up Supabase database:
   - Run the SQL schema in `lib/db/schema.sql` in your Supabase SQL editor

4. Set up Farcaster manifest:
   - Update `/.well-known/farcaster.json` with your account association signature
   - Use Farcaster Developer Tools to generate the signature

5. Run the development server:
```bash
npm run dev
```

## Database Schema

The app uses the following Supabase tables:
- `users`: User profiles
- `swipes`: Swipe actions
- `matches`: Mutual matches
- `notifications`: Notification settings per user

## Routes

- `/` - Landing page with SIWF
- `/onboarding` - Profile creation
- `/discover` - Main swipe interface
- `/matches` - List of matches
- `/profile` - User profile (editable)

## API Routes

- `/api/auth/callback` - SIWF callback handler
- `/api/auth/check` - Auth status check
- `/api/profile` - Create/update profile
- `/api/swipe` - Handle swipe actions
- `/api/webhook` - Farcaster webhook handler
- `/api/notify` - Internal notification trigger

## Design System

Follows Base blockchain design guidelines:
- Base brand colors (#0052FF, #000000, #FFFFFF)
- 4px grid system
- Mobile-first responsive design
- Clean, minimal UI

## Production Deployment

1. Deploy to Vercel
2. Update environment variables
3. Set up Farcaster manifest (use hosted manifest URL or update `.well-known/farcaster.json`)
4. Configure webhook URL in Farcaster Developer Portal
5. Test SIWF flow end-to-end

## License

MIT
