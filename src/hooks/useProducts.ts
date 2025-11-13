'use client';

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar productos
 * 
 * @description Obtiene y filtra productos de la API, con paginación y lazy loading
 * 
 * @param {UseProductsOptions} options - Opciones de configuración
 * @param {number} options.initialLimit - Número inicial de productos a mostrar (default: 6)
 * @param {string} options.category - Filtrar por categoría
 * @param {number} options.minPrice - Precio mínimo
 * @param {number} options.maxPrice - Precio máximo
 * @param {boolean} options.inStock - Solo productos con stock
 * 
 * @returns {Object} Objeto con productos, estado de carga y funciones de paginación
 */

interface Product {
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  created_at: string;
}

interface UseProductsOptions {
  initialLimit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { initialLimit = 6, category, minPrice, maxPrice, inStock } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construir query params
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
        if (inStock !== undefined) params.append('inStock', inStock.toString());

        const queryString = params.toString();
        const url = `/api/products${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, minPrice, maxPrice, inStock]);

  // Actualizar productos mostrados cuando cambia el límite o los productos
  useEffect(() => {
    setDisplayedProducts(products.slice(0, limit));
  }, [products, limit]);

  const loadMore = () => {
    setLimit((prev) => prev + initialLimit);
  };

  const hasMore = displayedProducts.length < products.length;

  return {
    products: displayedProducts,
    allProducts: products,
    loading,
    error,
    hasMore,
    loadMore,
    total: products.length,
    displayed: displayedProducts.length,
  };
}
