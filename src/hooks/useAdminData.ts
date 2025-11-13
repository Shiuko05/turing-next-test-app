'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

/**
 * Hook para cargar datos del panel de administración
 * 
 * @description Obtiene productos, pedidos y usuarios en paralelo
 * Solo funciona si el usuario tiene rol 'admin'
 * 
 * @param {boolean} isAdmin - Indica si el usuario es administrador
 * @returns {Object} Datos de admin, estados de carga y error
 */

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
}

interface Purchase {
  purchase_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  purchase_date: string;
  users: {
    username: string;
    lastname: string;
    email: string;
  };
  products: {
    name: string;
    price: number;
    category: string;
  };
}

interface User {
  user_id: string;
  username: string;
  lastname: string;
  email: string;
  role: string;
  created_at: string;
}

interface AdminData {
  productos: Product[];
  pedidos: Purchase[];
  usuarios: User[];
  loading: boolean;
  error: string | null;
}

export function useAdminData(isAdmin: boolean) {
  const [data, setData] = useState<AdminData>({
    productos: [],
    pedidos: [],
    usuarios: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const supabase = createClient();
        // Obtener token de sesión
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          setData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'No hay token de sesión' 
          }));
          return;
        }

        // Fetch todos los datos en paralelo
        const [productsRes, purchasesRes, usersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/purchased', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        // Procesar respuestas
        const productos = productsRes.ok 
          ? (await productsRes.json()).products || []
          : [];

        const pedidos = purchasesRes.ok 
          ? (await purchasesRes.json()).purchases || []
          : [];

        const usuarios = usersRes.ok 
          ? (await usersRes.json()).users || []
          : [];

        setData({
          productos,
          pedidos,
          usuarios,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error al cargar datos:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        }));
      }
    };

    fetchData();
  }, [isAdmin]);

  return data;
}
