import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  const hasDemoCookie = request.cookies.has('campuskart_demo_user') || request.cookies.has('campuskart_session');

  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith('/admin');
  const isStudentProtectedRoute = [
    '/dashboard',
    '/profile',
    '/verification',
    '/cart',
    '/orders',
    '/wishlist',
    '/products/my-listings',
    '/products/new',
  ].some((route) => path.startsWith(route));

  // If unauthenticated user (no Supabase session AND no local demo cookie) tries to access protected routes
  if (!session && !hasDemoCookie && (isAdminRoute || isStudentProtectedRoute)) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
