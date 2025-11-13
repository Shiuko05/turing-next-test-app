import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, createClientWithToken } from '@/lib/supabase';

// Función helper para verificar si el usuario es admin
async function verifyAdmin(token: string) {
  const userClient = createClientWithToken(token);
  
  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (authError || !user) {
    return { isAdmin: false, userId: null, error: 'Token inválido' };
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (userError || userData?.role !== 'admin') {
    return { isAdmin: false, userId: user.id, error: 'No tienes permisos de administrador' };
  }

  return { isAdmin: true, userId: user.id, error: null };
}

// GET /api/users/[id] - Obtener usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
      
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { isAdmin, error: verifyError } = await verifyAdmin(token);

    if (!isAdmin) {
      return NextResponse.json({ error: verifyError }, { status: 403 });
      }
      
    console.log('Fetching user with ID:', id);

    // Obtener usuario
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('user_id, username, lastname, email, role, created_at, updated_at')
      .eq('user_id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: `Error al obtener usuario. ${error}` },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
      
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { isAdmin, error: verifyError } = await verifyAdmin(token);

    if (!isAdmin) {
      return NextResponse.json({ error: verifyError }, { status: 403 });
    }

    // Obtener datos del body
    const body = await request.json();
    const { username, lastname, email, role, password } = body;

    // Validar que haya al menos un campo para actualizar
    if (!username && !lastname && !email && !role && !password) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un campo para actualizar' },
        { status: 400 }
      );
    }

    // Validar rol si se proporciona
    if (role && !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'El rol debe ser "user" o "admin"' },
        { status: 400 }
      );
    }

    // Actualizar en auth si hay email o password
    if (email || password) {
      const updateData: { email?: string; password?: string } = {};
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        id,
        updateData
      );

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        );
      }
    }

    // Preparar datos para actualizar en tabla users
    const updateData: { username?: string; lastname?: string; email?: string; role?: string; updated_at: string } = { updated_at: new Date().toISOString() };
    if (username) updateData.username = username;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    // Actualizar en tabla users
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('user_id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Usuario actualizado exitosamente',
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al actualizar usuario. ${error}` },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { isAdmin, userId, error: verifyError } = await verifyAdmin(token);

    if (!isAdmin) {
      return NextResponse.json({ error: verifyError }, { status: 403 });
    }

    // Prevenir que el admin se elimine a sí mismo
    if (userId === id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('user_id')
      .eq('user_id', id)
      .single();

    if (checkError || !existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar de auth.users (cascade eliminará de tabla users)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
      id
    );

    if (deleteAuthError) {
      return NextResponse.json(
        { error: deleteAuthError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Usuario eliminado exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al eliminar usuario. ${error}` },
      { status: 500 }
    );
  }
}