import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient, Errors } from '@farcaster/quick-auth'

const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'localhost:3000'
const client = createClient()

// Store session after Quick Auth verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, fid } = body

    if (!token || !fid) {
      return NextResponse.json({ error: 'Missing auth data' }, { status: 400 })
    }

    // Verify token before storing session
    try {
      const payload = await client.verifyJwt({ token, domain })
      if (Number(payload.sub) !== Number(fid)) {
        return NextResponse.json({ error: 'Token mismatch' }, { status: 401 })
      }
    } catch (e) {
      if (e instanceof Errors.InvalidTokenError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      throw e
    }

    // Set auth cookies
    const cookieStore = await cookies()
    cookieStore.set('fid', fid.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour (matches JWT expiration)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Session creation failed' },
      { status: 500 }
    )
  }
}

