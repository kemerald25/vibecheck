import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { neynarClient } from '@/lib/neynar'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Get recent casts from Neynar
    let recentCasts = null
    try {
      const castsResponse = await neynarClient.fetchCastsForUser({ fid: user.fid, limit: 3 })
      recentCasts = (castsResponse as any).result?.casts || (castsResponse as any).casts || []
    } catch (error) {
      console.error('Error fetching casts:', error)
    }

    // Update user profile
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        display_name: body.display_name,
        bio: body.bio,
        space: body.space,
        tags: body.tags,
        skills: body.skills,
        availability: body.availability || null,
        portfolio_links: body.portfolio_links || [],
        recent_casts: recentCasts,
        updated_at: new Date().toISOString(),
      })
      .eq('fid', user.fid)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    )
  }
}

