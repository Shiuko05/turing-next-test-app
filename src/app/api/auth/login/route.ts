import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * POST /api/auth/login
 * 
 * @description Endpoint para iniciar sesión de usuarios
 * @body {string} email - Correo electrónico del usuario
 * @body {string} password - Contraseña del usuario
 * @returns {Object} Sesión y tokens de autenticación
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
  
    // Validar datos de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      );
    }
  
    // Iniciar sesión con Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Devolver tokens para que el cliente los guarde
    return NextResponse.json(
      { 
        user: data.user,
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error al iniciar sesión. ${error}` },
      { status: 500 }
    );
  }
}