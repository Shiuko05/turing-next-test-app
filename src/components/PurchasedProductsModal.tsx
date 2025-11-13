'use client';

import { useEffect, useRef } from 'react';
import { Package, ShoppingBag, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { usePurchased } from '@/hooks/usePurchased';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';

interface PurchasedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchasedProductsModal({ isOpen, onClose }: PurchasedProductsModalProps) {
  const { purchases, loading, error, fetchPurchases } = usePurchased();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchPurchases();
    }
    
    if (!isOpen) {
      hasFetchedRef.current = false;
    }
  }, [isOpen, fetchPurchases]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white border-gray-200 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#6ee7b7] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#1e293b]" />
            </div>
            <div>
              <DialogTitle className="text-[#1e293b] text-xl font-bold">Mis Compras</DialogTitle>
              <DialogDescription className="text-gray-600">
                Historial de productos comprados
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#6ee7b7] animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No tienes compras registradas</p>
            <p className="text-sm text-gray-400 mt-2">Tus compras aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.purchase_id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#6ee7b7] transition-colors"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center shrink-0">
                  {purchase.products.image_url ? (
                    <Image
                      src={purchase.products.image_url}
                      alt={purchase.products.name}
                      width={80}
                      height={80}
                      className="object-contain rounded"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Purchase Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#1e293b] mb-1 truncate">
                    {purchase.products.name}
                  </h4>
                  <p className="text-xs text-gray-500 uppercase mb-2">
                    {purchase.products.category}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Package className="w-3 h-3" />
                      <span>Cantidad: {purchase.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-3 h-3" />
                      <span>Total: ${purchase.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(purchase.purchase_date)}</span>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="flex flex-col items-end justify-between">
                  <div className="bg-[#6ee7b7] text-[#1e293b] px-3 py-1 rounded-full font-semibold text-sm">
                    ${purchase.total_price.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">
                    ${purchase.products.price.toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && purchases.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Total de compras:
              </span>
              <span className="text-lg font-bold text-[#1e293b]">
                {purchases.length} {purchases.length === 1 ? 'compra' : 'compras'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-600">
                Inversión total:
              </span>
              <span className="text-2xl font-bold text-[#6ee7b7]">
                ${purchases.reduce((sum, p) => sum + p.total_price, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
