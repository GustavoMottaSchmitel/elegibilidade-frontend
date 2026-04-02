import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  let token = request.cookies.get('ata_token')?.value
  
  const urlToken = request.nextUrl.searchParams.get('token')
  if (urlToken) {
    // Redireciona limpando a URL original, usando HTTP 303 para evitar o cache do redirect.
    const urlWithoutToken = new URL(request.nextUrl.pathname, request.url)
    const response = NextResponse.redirect(urlWithoutToken, 303)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    
    // Sobrescreve agressivamente o cookie em todos path='/'
    response.cookies.set('ata_token', urlToken, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })
    return response
  }

  // Elegibilidade dashboard and app routes should be protected.
  if (!token) {
    const isLocal = process.env.NODE_ENV === 'development'
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
