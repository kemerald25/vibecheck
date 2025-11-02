import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const fid = request.cookies.get('fid')?.value
  const pathname = request.nextUrl.pathname

  // Public routes
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Protected routes require auth
  if (!fid && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|og.png|.well-known).*)',
  ],
}

