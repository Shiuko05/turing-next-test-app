import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, createClientWithToken } from '@/lib/supabase-server';

// GET /api/users - Listar usuarios
export async function GET(request: NextRequest) {
  try {
    // Obtener token del header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userClient = createClientWithToken(token);

    // Obtener usuario actual
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos de administrador' },
        { status: 403 }
      );
    }

    // Si es admin, listar todos los usuarios
    const { data: users, error: listError } = await supabaseAdmin
      .from('users')
      .select('user_id, username, lastname, email, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (listError) {
      return NextResponse.json(
        { error: listError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        users,
        total: users.length 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al listar usuarios. ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/users - Crear usuario
export async function POST(request: NextRequest) {
  try {
    // Obtener token del header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userClient = createClientWithToken(token);

    // Obtener usuario actual
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos de administrador' },
        { status: 403 }
      );
    }

    // Obtener datos del body
    const { email, password, username, lastname, role = 'user', email_confirm } = await request.json();

    // Validar datos requeridos
    if (!email || !password || !username || !lastname) {
      return NextResponse.json(
        { error: 'Email, password, username y lastname son requeridos' },
        { status: 400 }
      );
    }

    // Validar rol
    if (role && !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'El rol debe ser "user" o "admin"' },
        { status: 400 }
      );
    }
    
    // Validar si el email debe ser confirmado o no
    if (email_confirm) {
        const { data: authData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${request.nextUrl.origin}/api/auth/callback`,
                data: {
                    username,
                    lastname,
                    role
                }
            }
        })

        if(signUpError) {
            return NextResponse.json(
                { error: signUpError.message },
                { status: 400 }
            )
        }

        // El trigger 'handle_new_user' insertará automáticamente en la tabla users
        // cuando el usuario confirme su email

        return NextResponse.json(
        { 
            message: 'Usuario creado exitosamente. Revisar el correo para confirmar la cuenta',
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
        
    } else {

        // Crear usuario en Supabase Auth
        const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Admin puede crear usuarios ya confirmados
        user_metadata: {
            username,
            lastname
        }
        });

        if (signUpError) {
        return NextResponse.json(
            { error: signUpError.message },
            { status: 400 }
        );
        }

        // Insertar en tabla users
        const { data: newUser, error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            user_id: authData.user.id,
            username,
            lastname,
            email,
            role
          })
          .select()
          .single();

        if (insertError) {
          // Si falla, eliminar de auth
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        
          return NextResponse.json(
            { error: insertError.message },
            { status: 400 }
          );
        }

        return NextResponse.json(
        {
            message: 'Usuario creado exitosamente',
            user: newUser
        },
        { status: 201 }
        )
    }

  } catch (error) {
    return NextResponse.json(
      { error: `Error al crear usuario. ${error}` },
      { status: 500 }
    );
  }
}