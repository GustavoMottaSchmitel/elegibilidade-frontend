import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('ata_token')?.value

  // Elegibilidade dashboard and app routes should be protected.
  if (!token) {
    // Redirect to central login in production, or localhost:3000 locally
    const isLocal = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1'
    const loginUrl = isLocal 
      ? 'http://localhost:3000/login' 
      : 'https://central-atasistemas.duckdns.org/login'
    
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Protect everything except api routes and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf)$).*)'],
}
