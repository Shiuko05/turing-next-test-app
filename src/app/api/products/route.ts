import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, createClientWithToken } from '@/lib/supabase-server';

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
 * GET /api/products
 * 
 * @description Obtiene lista de productos con filtros opcionales
 * @public No requiere autenticación
 * @query {string} category - Filtrar por categoría
 * @query {number} minPrice - Precio mínimo
 * @query {number} maxPrice - Precio máximo
 * @query {boolean} inStock - Solo productos con stock
 * @returns {Object} Lista de productos y total
 */
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

/**
 * POST /api/products
 * 
 * @description Crea uno o múltiples productos (solo admin)
 * @requires Autenticación con rol 'admin'
 * @body {Object|Array} Producto(s) a crear con name, price, stock, category
 * @returns {Object} Producto(s) creado(s) y mensaje de confirmación
 */
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
    const bodyData = await request.json();
    const isArray = Array.isArray(bodyData);

    // Función de validación
    const validateProduct = (product: Record<string, unknown>) => {
      if (!product.name || product.price === undefined || product.stock === undefined || !product.category) {
        return { valid: false, error: 'name, price, stock y category son requeridos' };
      }
      if (typeof product.price !== 'number' || product.price < 0) {
        return { valid: false, error: 'El precio debe ser un número mayor o igual a 0' };
      }
      if (typeof product.stock !== 'number' || !Number.isInteger(product.stock) || product.stock < 0) {
        return { valid: false, error: 'El stock debe ser un número entero mayor o igual a 0' };
      }
      return { valid: true };
    };

    // Validar datos
    if (isArray) {
      // Validar cada producto en el array
      for (let i = 0; i < bodyData.length; i++) {
        const validation = validateProduct(bodyData[i]);
        if (!validation.valid) {
          return NextResponse.json(
            { error: `Producto ${i + 1}: ${validation.error}` },
            { status: 400 }
          );
        }
      }
    } else {
      // Validar producto único
      const validation = validateProduct(bodyData);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // Preparar datos para insertar
    const dataToInsert = isArray 
      ? bodyData.map((p: Record<string, unknown>) => ({
          name: p.name,
          description: p.description || null,
          price: p.price,
          stock: p.stock,
          category: p.category,
          image_url: p.image_url || null
        }))
      : {
          name: bodyData.name,
          description: bodyData.description || null,
          price: bodyData.price,
          stock: bodyData.stock,
          category: bodyData.category,
          image_url: bodyData.image_url || null
        };

    const { data: newProducts, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(dataToInsert)
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: isArray ? `${newProducts.length} productos creados exitosamente` : 'Producto creado exitosamente',
        products: newProducts,
        total: newProducts.length
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