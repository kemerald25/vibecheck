import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fid, type, matchId, viewerFid } = body

    // Get notification settings
    const { data: notificationSettings } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('fid', fid)
      .eq('enabled', true)
      .single()

    if (!notificationSettings?.notification_url || !notificationSettings?.notification_token) {
      return NextResponse.json({ error: 'No notification settings found' }, { status: 404 })
    }

    // Prepare notification payload
    let title = ''
    let message = ''

    if (type === 'match') {
      title = '🎉 New Match!'
      message = 'You have a new match on Vibe Check!'
    } else if (type === 'profile_view') {
      title = '👀 Profile View'
      message = 'Someone viewed your profile'
    }

    // Send notification
    const response = await fetch(notificationSettings.notification_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notificationSettings.notification_token}`,
      },
      body: JSON.stringify({
        notificationId: matchId || `view-${viewerFid}-${fid}`,
        title,
        body: message,
      }),
    })

    if (!response.ok) {
      throw new Error(`Notification failed: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Notification failed' },
      { status: 500 }
    )
  }
}

