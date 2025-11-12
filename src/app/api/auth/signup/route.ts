import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, lastname } = await request.json();

    // Validar datos de entrada
    if (!email || !password || !username || !lastname) {
      return NextResponse.json(
        { error: 'Email, password, username y lastname son requeridos' },
        { status: 400 }
      );
    }

    // Registrar usuario con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/api/auth/callback`,
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Insertar datos adicionales en la tabla users
    if (authData.user) {
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
          user_id: authData.user.id,
          username: username,
          lastname: lastname,
          email: authData.user.email,
        });

      if (dbError) {
        return NextResponse.json(
          { error: dbError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente. Revisa tu correo para confirmar tu cuenta.',
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          username,
          lastname
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