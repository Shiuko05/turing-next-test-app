import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * GET /api/stats
 * 
 * @description Obtiene estadísticas públicas de la tienda
 * @public No requiere autenticación
 * @returns {Object} Top 3 compradores, total de productos y compras
 */
export async function GET() {
  try {
    // Obtener todas las compras con información del usuario
    const { data: purchases, error: purchasesError } = await supabaseAdmin
      .from('purchased')
      .select('user_id, total_price');

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      return NextResponse.json(
        { topBuyers: [] },
        { status: 200 }
      );
    }

    // Agrupar compras por usuario
    const buyerStats: Record<string, { 
      count: number; 
      total: number 
    }> = {};

    purchases?.forEach((purchase) => {
      const userId = purchase.user_id;
      const totalPrice = purchase.total_price || 0;

      if (!buyerStats[userId]) {
        buyerStats[userId] = { count: 0, total: 0 };
      }

      buyerStats[userId].count += 1;
      buyerStats[userId].total += totalPrice;
    });

    // Obtener IDs de los top 3 usuarios por número de compras
    const topUserIds = Object.entries(buyerStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([userId]) => userId);

    // Obtener información de los usuarios
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from('users')
      .select('user_id, username, lastname')
      .in('user_id', topUserIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // Crear un mapa de usuarios
    const usersMap = new Map(
      usersData?.map(user => [user.user_id, user]) || []
    );

    // Construir el array de top buyers con la información del usuario
    const topBuyers = topUserIds
      .map(userId => {
        const user = usersMap.get(userId);
        const stats = buyerStats[userId];
        
        return {
          user_id: userId,
          username: user?.username || 'Usuario',
          lastname: user?.lastname || 'Desconocido',
          purchase_count: stats.count,
          total_spent: stats.total,
        };
      });

    // Obtener total de productos
    const { count: productsCount } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Obtener total de compras
    const { count: purchasesCount } = await supabaseAdmin
      .from('purchased')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json(
      {
        topBuyers,
        totalProducts: productsCount || 0,
        totalPurchases: purchasesCount || 0,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        topBuyers: [],
        totalProducts: 0,
        totalPurchases: 0,
      },
      { status: 200 }
    );
  }
}
