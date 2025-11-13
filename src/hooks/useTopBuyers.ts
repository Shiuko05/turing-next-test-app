'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para obtener los top 3 compradores
 * 
 * @description Consulta /api/stats para obtener estadísticas
 * de los clientes con más compras realizadas
 * 
 * @returns {Object} Lista de top buyers, loading y error
 */

interface TopBuyer {
  user_id: string;
  username: string;
  lastname: string;
  purchase_count: number;
  total_spent: number;
}

export function useTopBuyers() {
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopBuyers() {
      try {
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }

        const data = await response.json();
        setTopBuyers(data.topBuyers || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching top buyers:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setTopBuyers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopBuyers();
  }, []);

  return { topBuyers, loading, error };
}
