'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';

/**
 * Hook para obtener el historial de compras del usuario
 * 
 * @description Realiza petición GET a /api/purchased para obtener
 * todas las compras del usuario autenticado
 * 
 * @returns {Object} Lista de compras, estado de carga y función fetch
 */

interface Product {
  name: string;
  price: number;
  category: string;
  image_url: string | null;
}

interface User {
  username: string;
  lastname: string;
  email: string;
}

interface Purchase {
  purchase_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  purchase_date: string;
  users: User;
  products: Product;
}

interface PurchasedResponse {
  purchases: Purchase[];
  total: number;
}

export function usePurchased() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('No hay sesión activa');
        return;
      }

      const response = await fetch(`/api/purchased?user_id=${session.user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener las compras');
      }

      const data: PurchasedResponse = await response.json();
      setPurchases(data.purchases || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    purchases,
    loading,
    error,
    fetchPurchases,
  };
}
