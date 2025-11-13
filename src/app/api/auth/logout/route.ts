import { NextRequest, NextResponse } from 'next/server';
import { createClientWithToken } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Obtener el token del header Authorization
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Crear cliente con el token del usuario
    const userClient = createClientWithToken(token);

    // Cerrar sesión del usuario específico
    const { error } = await userClient.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error al cerrar sesión. ${error}` },
      { status: 500 }
    );
  }
}