import { NextRequest, NextResponse } from 'next/server'
import { createClient, Errors } from '@farcaster/quick-auth'
import { neynarClient } from '@/lib/neynar'
import { supabaseAdmin } from '@/lib/supabase'

const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'localhost:3000'
const client = createClient()

// This endpoint verifies the Quick Auth JWT and returns user data
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization')
  
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authorization.split(' ')[1]

  try {
    const payload = await client.verifyJwt({ token, domain })
    const fid = Number(payload.sub)

    // Get user data from Neynar
    let user = null
    try {
      const userResponse = await neynarClient.fetchBulkUsers({ fids: [fid] })
      user = userResponse.users[0]
    } catch (error) {
      console.error('Error fetching user from Neynar:', error)
    }

    // Store/update user in Supabase
    const { error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({
        fid,
        signer_uuid: `quick-auth-${fid}`, // Placeholder since Quick Auth doesn't provide signer_uuid
        display_name: user?.display_name || `User ${fid}`,
        pfp_url: (user as any)?.pfp?.url || (user as any)?.pfp_url || null,
        follower_count: (user as any)?.follower_count || 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'fid',
      })

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError)
    }

    // Check if user has completed profile
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('space, bio')
      .eq('fid', fid)
      .single()

    const redirectUrl = existingUser?.space && existingUser?.bio
      ? '/discover'
      : '/onboarding'

    return NextResponse.json({
      fid,
      redirectUrl,
    })
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    console.error('Auth error:', e)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

