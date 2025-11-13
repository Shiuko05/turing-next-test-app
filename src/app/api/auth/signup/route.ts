import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * POST /api/auth/signup
 * 
 * @description Endpoint para registrar nuevos usuarios
 * @body {string} email - Correo electrónico
 * @body {string} password - Contraseña (mín 6 caracteres)
 * @body {string} username - Nombre del usuario
 * @body {string} lastname - Apellido del usuario
 * @body {string} role - Rol del usuario (default: 'user')
 * @returns {Object} Mensaje de confirmación y datos básicos del usuario
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, username, lastname, role = 'user' } = await request.json();

    // Validar datos de entrada
    if (!email || !password || !username || !lastname) {
      return NextResponse.json(
        { error: 'Email, password, username y lastname son requeridos' },
        { status: 400 }
      );
    }

    // Registrar usuario con Supabase Auth y guardar metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/api/auth/callback`,
        data: {
          username: username,
          lastname: lastname,
          role: role
        }
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // El trigger 'handle_new_user' insertará automáticamente en la tabla users
    // cuando el usuario confirme su email

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente. Revisa tu correo para confirmar tu cuenta.',
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          username,
          lastname,
          role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error interno del servidor. ${error}` },
      { status: 500 }
    );
  }
}