import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (!code) {
    // Redirigir a página para manejar el hash
    return NextResponse.redirect(new URL('/auth/confirm', request.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error al intercambiar código:', error);
    return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url));
  }

  return NextResponse.redirect(new URL('/home', request.url));
}