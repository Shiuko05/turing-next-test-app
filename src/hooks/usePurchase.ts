'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

/**
 * Hook para gestionar el flujo completo de compra de productos
 * 
 * @description Maneja la selección de productos, control de cantidad,
 * verificación de autenticación y procesamiento de compras
 * 
 * @returns {Object} Estado de compra y funciones para gestionar el proceso
 */

interface Product {
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
}

interface PurchaseResult {
  success: boolean;
  message?: string;
  error?: string;
}

export function usePurchase() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuthentication = async (): Promise<boolean> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const authenticated = !!session;
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  const initiatePurchase = async (product: Product) => {
    const authenticated = await checkAuthentication();
    
    if (!authenticated) {
      router.push('/login');
      return;
    }

    setSelectedProduct(product);
    setQuantity(1);
    setPurchaseError(null);
  };

  const updateQuantity = (newQuantity: number) => {
    if (!selectedProduct) return;
    
    const validQuantity = Math.max(1, Math.min(selectedProduct.stock, newQuantity));
    setQuantity(validQuantity);
  };

  const incrementQuantity = () => {
    updateQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    updateQuantity(quantity - 1);
  };

  const confirmPurchase = async (): Promise<PurchaseResult> => {
    if (!selectedProduct) {
      return { success: false, error: 'No hay producto seleccionado' };
    }

    setPurchasing(true);
    setPurchaseError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return { success: false, error: 'Sesión expirada' };
      }

      const response = await fetch('/api/purchased', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          product_id: selectedProduct.product_id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Error al procesar la compra';
        setPurchaseError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Compra exitosa
      const total = selectedProduct.price * quantity;
      return {
        success: true,
        message: `¡Compra realizada exitosamente! Total: $${total.toFixed(2)}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la compra';
      setPurchaseError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setPurchasing(false);
    }
  };

  const cancelPurchase = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setPurchaseError(null);
  };

  const getTotalPrice = (): number => {
    return selectedProduct ? selectedProduct.price * quantity : 0;
  };

  return {
    // State
    selectedProduct,
    quantity,
    purchasing,
    purchaseError,
    isAuthenticated,
    
    // Actions
    initiatePurchase,
    confirmPurchase,
    cancelPurchase,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    checkAuthentication,
    
    // Computed
    getTotalPrice,
  };
}
