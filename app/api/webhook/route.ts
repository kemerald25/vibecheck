import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature (implement according to Farcaster docs)
    // For now, we'll trust the request if it comes from the right origin

    if (body.type === 'miniapp_added') {
      const { fid, notificationToken, notificationUrl } = body

      // Store notification settings
      await supabaseAdmin
        .from('notifications')
        .upsert({
          fid: Number(fid),
          notification_token: notificationToken,
          notification_url: notificationUrl,
          enabled: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'fid',
        })

      return NextResponse.json({ success: true })
    }

    // Handle other webhook types (profile_view, etc.)
    if (body.type === 'profile_view') {
      const { viewerFid, profileFid } = body
      
      // Send notification to profile owner
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid: profileFid,
          type: 'profile_view',
          viewerFid,
        }),
      }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

