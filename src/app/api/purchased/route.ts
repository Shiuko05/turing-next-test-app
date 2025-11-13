import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, createClientWithToken } from '@/lib/supabase-server';

// Función helper para verificar autenticación
async function verifyAuthentication(token: string) {
  const userClient = createClientWithToken(token);
  
  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (authError || !user) {
    return { isAuthenticated: false, userId: null, error: 'Token inválido o expirado' };
  }

  return { isAuthenticated: true, userId: user.id, error: null };
}

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

/**
 * GET /api/purchased
 * 
 * @description Obtiene historial de compras del usuario
 * @requires Autenticación (token Bearer)
 * @query {string} user_id - Filtrar por usuario (admin puede ver cualquiera)
 * @query {string} product_id - Filtrar por producto
 * @returns {Object} Lista de compras con detalles de usuario y producto
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    // Verificar si está autenticado y obtener userId
    const { isAuthenticated, userId, error: authError } = await verifyAuthentication(token);

    if (!isAuthenticated) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Verificar si es admin
    const { isAdmin } = await verifyAdmin(token);

    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get('user_id');
    const filterProductId = searchParams.get('product_id');

    let query = supabaseAdmin
      .from('purchased')
      .select(`
        purchase_id,
        user_id,
        product_id,
        quantity,
        total_price,
        purchase_date,
        users:user_id (
          username,
          lastname,
          email
        ),
        products:product_id (
          name,
          price,
          category,
          image_url
        )
      `)
      .order('purchase_date', { ascending: false });

    // Si NO es admin, solo ver sus propias compras
    if (!isAdmin) {
      query = query.eq('user_id', userId);
    } else {
      // Si es admin, puede filtrar por user_id
      if (filterUserId) {
        query = query.eq('user_id', filterUserId);
      }
    }

    // Filtrar por producto (ambos pueden)
    if (filterProductId) {
      query = query.eq('product_id', filterProductId);
    }

    const { data: purchases, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        purchases,
        total: purchases.length 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al listar compras. ${error}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/purchased
 * 
 * @description Procesa una nueva compra de producto
 * @requires Autenticación (token Bearer)
 * @body {string} product_id - UUID del producto a comprar
 * @body {number} quantity - Cantidad a comprar (entero > 0)
 * @returns {Object} Detalles de la compra y stock restante
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó token de autenticación' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { isAuthenticated, userId, error: authError } = await verifyAuthentication(token);

    if (!isAuthenticated) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Obtener datos del body
    const body = await request.json();
    
    const { product_id, quantity } = body;

    // Validar campos requeridos
    if (!product_id || !quantity) {
      return NextResponse.json(
        { error: 'product_id y quantity son requeridos' },
        { status: 400 }
      );
    }

    // Validar quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser un número entero mayor a 0' },
        { status: 400 }
      );
    }

    // Validar UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(product_id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

    // Llamar a la función de PostgreSQL que maneja la transacción
    const { data: result, error: functionError } = await supabaseAdmin
      .rpc('process_purchase', {
        p_user_id: userId,
        p_product_id: product_id,
        p_quantity: quantity
      });

    if (functionError) {
      // Manejar errores específicos
      if (functionError.message.includes('Producto no encontrado')) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }

      if (functionError.message.includes('Producto no disponible')) {
        // Extraer el nombre del producto del mensaje
        const match = functionError.message.match(/producto "(.+)" está inactivo/i);
        const productName = match ? match[1] : 'este producto';
        
        return NextResponse.json(
          { 
            error: 'Producto no disponible',
            message: `No se puede comprar ${productName} porque está inactivo`,
            product_id: product_id
          },
          { status: 400 }
        );
      }

      if (functionError.message.includes('Stock insuficiente')) {
        const match = functionError.message.match(/Disponible: (\d+), Solicitado: (\d+)/);
        return NextResponse.json(
          { 
            error: 'Stock insuficiente',
            available_stock: match ? parseInt(match[1]) : 0,
            requested_quantity: match ? parseInt(match[2]) : quantity
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: functionError.message },
        { status: 400 }
      );
    }

    // Obtener detalles completos de la compra creada
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchased')
      .select(`
        purchase_id,
        user_id,
        product_id,
        quantity,
        total_price,
        purchase_date,
        products:product_id (
          name,
          price,
          category,
          image_url,
          status
        )
      `)
      .eq('purchase_id', result.purchase_id)
      .single();

    if (purchaseError) {
      return NextResponse.json(
        { error: 'Error al obtener detalles de la compra' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Compra realizada exitosamente',
        purchase: purchase,
        remaining_stock: result.remaining_stock
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Error al realizar compra. ${error}` },
      { status: 500 }
    );
  }
}