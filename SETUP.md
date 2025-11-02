# Setup Instructions for Vibe Check

## Prerequisites

1. Node.js 18+ installed
2. A Neynar account with API keys
3. A Supabase project
4. A Farcaster account for manifest setup

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Neynar Configuration
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id
NEYNAR_API_KEY=your_neynar_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional
JWT_SECRET=your_random_jwt_secret
FARCASTER_MANIFEST_URL=https://farcaster.xyz/.well-known/vibecheck-manifest.json
```

### Getting Your Keys

#### Neynar Keys
1. Go to [Neynar Developer Portal](https://neynar.com/)
2. Create an app and get your Client ID and API Key

#### Supabase Keys
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings > API to get your URL and keys

## Step 3: Set Up Supabase Database

1. Open your Supabase project
2. Go to SQL Editor
3. Copy and paste the contents of `lib/db/schema.sql`
4. Run the SQL to create all tables

## Step 4: Set Up Farcaster Manifest

1. Generate your account association signature using [Farcaster Developer Tools](https://warpcast.com/~/developers)
2. Update `/.well-known/farcaster.json` with:
   - Your account association signature
   - Your app URLs
   - Your webhook URL (for production)

Alternatively, use Farcaster Hosted Manifests and update `next.config.js` redirect.

## Step 5: Add Placeholder Images

Add the following images to the `public/` directory:

- `icon.png` - 200x200px app icon
- `og.png` - 1200x630px Open Graph image

## Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

## Step 7: Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables in Vercel settings
4. Deploy!

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database schema created in Supabase
- [ ] Farcaster manifest updated with production URLs
- [ ] Webhook URL configured in Farcaster Developer Portal
- [ ] Placeholder images replaced with actual assets
- [ ] Test SIWF flow end-to-end
- [ ] Test swipe and match functionality
- [ ] Test notification webhooks

## Troubleshooting

### SIWF Not Working
- Ensure `NEXT_PUBLIC_NEYNAR_CLIENT_ID` is correctly set
- Check browser console for errors
- Verify callback URL is accessible

### Database Errors
- Verify Supabase connection strings
- Check that all tables were created
- Ensure Row Level Security policies are configured (if needed)

### Manifest Issues
- Verify manifest is accessible at `/.well-known/farcaster.json`
- Check account association signature is valid
- Ensure production domain matches exactly

