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

// GET /api/products - Listar todos los productos
export async function GET(request: NextRequest) {
  try {
    // Los productos son públicos, no requieren autenticación para listar
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');

    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtros opcionales
    if (category) {
      query = query.eq('category', category);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      query = query.gt('stock', 0);
    }

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        products,
        total: products.length 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al listar productos. ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear producto
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
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
    const { name, description, price, stock, category, image_url } = await request.json();

    // Validar campos requeridos
    if (!name || price === undefined || stock === undefined || !category) {
      return NextResponse.json(
        { error: 'name, price, stock y category son requeridos' },
        { status: 400 }
      );
    }

    // Validar tipos de datos
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'El precio debe ser un número mayor o igual a 0' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: 'El stock debe ser un número entero mayor o igual a 0' },
        { status: 400 }
      );
    }

    // Insertar producto
    const { data: newProduct, error: insertError } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description: description || null,
        price,
        stock,
        category,
        image_url: image_url || null
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Producto creado exitosamente',
        product: newProduct
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al crear producto. ${error}` },
      { status: 500 }
    );
  }
}