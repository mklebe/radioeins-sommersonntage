import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.includes("/sonntag");
  const useridFromCookie = request.cookies.get("userid");
  
  if (isProtectedRoute) {
    console.log("Middleware cookie value", useridFromCookie, request.referrer, request.cookies)
    if(!useridFromCookie || !useridFromCookie.value) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  }

  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}