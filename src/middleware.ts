import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-middleware';
import { getUserRoleFromToken } from '@/lib/jwt';

/**
 * Middleware con soporte completo de cookies para Supabase
 * Protege rutas y verifica roles a nivel de servidor
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Crear cliente Supabase con manejo de cookies
  const { supabase, response } = createClient(request);

  // Obtener sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Verificar rutas protegidas
  if (isProtectedRoute) {
    // Si no hay sesión, redirigir a login
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si es ruta de admin, verificar rol
    if (pathname.startsWith('/admin')) {
      const token = session.access_token;
      const role = getUserRoleFromToken(token);

      if (role !== 'admin') {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'no_permission');
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  // Rutas de autenticación - redirigir si ya está autenticado
  const authRoutes = ['/login', '/signup'];
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (archivos públicos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
