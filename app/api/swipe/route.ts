import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { swiped_fid, action } = body

    // Check daily limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await supabaseAdmin
      .from('swipes')
      .select('*', { count: 'exact', head: true })
      .eq('swiper_fid', user.fid)
      .gte('created_at', today.toISOString())

    if ((count || 0) >= 20) {
      return NextResponse.json({ error: 'Daily swipe limit reached' }, { status: 429 })
    }

    // Save swipe
    const { error: swipeError } = await supabaseAdmin
      .from('swipes')
      .insert({
        swiper_fid: user.fid,
        swiped_fid,
        action,
      })

    if (swipeError) {
      return NextResponse.json({ error: swipeError.message }, { status: 500 })
    }

    // Check for match (mutual yes)
    if (action === 'yes') {
      const { data: reverseSwipe } = await supabaseAdmin
        .from('swipes')
        .select('*')
        .eq('swiper_fid', swiped_fid)
        .eq('swiped_fid', user.fid)
        .eq('action', 'yes')
        .single()

      if (reverseSwipe) {
        // Create match
        const fid1 = Math.min(user.fid, swiped_fid)
        const fid2 = Math.max(user.fid, swiped_fid)

        const { error: matchError } = await supabaseAdmin
          .from('matches')
          .insert({
            fid_1: fid1,
            fid_2: fid2,
          })

        if (!matchError) {
          // Trigger notifications for both users
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fid: user.fid,
              type: 'match',
              matchId: `${fid1}-${fid2}`,
            }),
          }).catch(console.error)

          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fid: swiped_fid,
              type: 'match',
              matchId: `${fid1}-${fid2}`,
            }),
          }).catch(console.error)

          return NextResponse.json({ match: true })
        }
      }
    }

    return NextResponse.json({ match: false })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    )
  }
}

