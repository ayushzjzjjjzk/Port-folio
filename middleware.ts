import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  if (hostname.startsWith('portfolio.')) {
    if (url.pathname.startsWith('/portfolio')) {
      return NextResponse.next();
    }
    url.pathname = `/portfolio${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|images|videos|models|sounds|textures|.*\\.pdf$).*)'],
};
