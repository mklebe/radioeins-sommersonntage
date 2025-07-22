import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = [
  '/sonntag',
  '/sonntag/Top100Darkness',
  '/sonntag/Top100Disko',
  '/sonntag/Top100Fifties',
  '/sonntag/Top100Friend',
  '/sonntag/Top100Night',
  '/sonntag/Top100NurEinWort',
  '/sonntag/Top100OneLove',
];
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  
  if (isProtectedRoute && !request.cookies.get("userid")) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}