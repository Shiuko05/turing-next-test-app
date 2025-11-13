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

// Validar UUID
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// GET /api/products/[id] - Obtener producto específico
export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

    // Obtener producto
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: `Error al obtener producto. ${error}` },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

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
    const body = await request.json();
    const { name, description, price, stock, category, image_url } = body;

    // Validar que haya al menos un campo para actualizar
    if (!name && !description && price === undefined && stock === undefined && !category && !image_url) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un campo para actualizar' },
        { status: 400 }
      );
    }

    // Validar tipos de datos si se proporcionan
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'El precio debe ser un número mayor o igual a 0' },
        { status: 400 }
      );
    }

    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
      return NextResponse.json(
        { error: 'El stock debe ser un número entero mayor o igual a 0' },
        { status: 400 }
      );
    }

    // Preparar datos para actualizar
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      stock?: number;
      category?: string;
      image_url?: string | null;
      updated_at: string;
    } = { 
      updated_at: new Date().toISOString() 
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (category) updateData.category = category;
    if (image_url !== undefined) updateData.image_url = image_url || null;

    // Actualizar producto
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('product_id', id)
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
        message: 'Producto actualizado exitosamente',
        product: updatedProduct
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al actualizar producto. ${error}` },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Actualizar status del producto (activar/desactivar)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

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

    // Obtener el status del body
    const body = await request.json();
    const { status } = body;

    // Validar que se proporcionó el status
    if (status === undefined) {
      return NextResponse.json(
        { error: 'El campo status es requerido (0 = inactivo, 1 = activo)' },
        { status: 400 }
      );
    }

    // Validar que el status sea válido
    if (![0, 1].includes(status)) {
      return NextResponse.json(
        { error: 'El status debe ser 0 (inactivo) o 1 (activo)' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('products')
      .select('product_id, name, status')
      .eq('product_id', id)
      .single();

    if (checkError || !existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya tiene ese status
    if (existingProduct.status === status) {
      return NextResponse.json(
        { 
          message: `El producto ya está ${status === 1 ? 'activo' : 'inactivo'}`,
          product: existingProduct
        },
        { status: 200 }
      );
    }

    // Actualizar status
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', id)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: `Producto ${status === 1 ? 'activado' : 'desactivado'} exitosamente`,
        product: updatedProduct
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al actualizar status del producto. ${error}` },
      { status: 500 }
    );
  }
}