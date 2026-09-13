import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './client';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!isSupabaseConfigured()) {
    const isDemo = request.cookies.get('nexus_demo_active')?.value === 'true';
    const isAuthUser = request.cookies.get('nexus_auth_session')?.value === 'true';
    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isPublicPage = pathname === '/' || pathname.startsWith('/api') || pathname.includes('.');

    if ((isDemo || isAuthUser) && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (!isDemo && !isAuthUser && !isAuthPage && !isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isDemo = request.cookies.get('nexus_demo_active')?.value === 'true';

    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isPublicPage = pathname === '/' || pathname.startsWith('/api') || pathname.includes('.');

    if (isDemo) {
      if (isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    if (!user && !isAuthPage && !isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (user && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error('Middleware auth check error:', err);
  }

  return supabaseResponse;
}
