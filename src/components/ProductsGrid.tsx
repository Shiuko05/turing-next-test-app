'use client';

import { useProducts } from '@/hooks/useProducts';
import { usePurchase } from '@/hooks/usePurchase';
import Image from 'next/image';
import { useEffect } from 'react';
import PurchaseModal from './PurchaseModal';

/**
 * Componente ProductsGrid
 * 
 * @description Muestra una cuadrícula de productos con funcionalidad de compra
 * Incluye paginación ("Ver más"), modal de confirmación y manejo de stock
 */
export default function ProductsGrid() {
  const { products, loading, error, hasMore, loadMore, displayed, total } = useProducts({
    initialLimit: 6,
  });

  const {
    selectedProduct,
    quantity,
    purchasing,
    purchaseError,
    initiatePurchase,
    confirmPurchase,
    cancelPurchase,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
    checkAuthentication,
  } = usePurchase();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handlePurchaseConfirm = async () => {
    const result = await confirmPurchase();
    
    if (result.success) {
      alert(result.message);
      cancelPurchase();
      window.location.reload();
    }
  };

  return (
    <section id="productos" className="py-16 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e293b]">
            Nuestros Productos
          </h2>
          <p className="text-gray-600 mt-2">
            Descubre nuestras mejores ofertas
          </p>
          {!loading && total > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Mostrando {displayed} de {total} productos
            </p>
          )}
        </div>

        {/* Loading State - Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <article 
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="h-48 bg-gray-300"></div>
                
                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  {/* Category Skeleton */}
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                  
                  {/* Title Skeleton */}
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  
                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  
                  {/* Price and Button Skeleton */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-1">
                      <div className="h-7 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-medium">❌ {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-[#6ee7b7] hover:text-[#5dd6a6] font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-gray-600 font-medium">No hay productos disponibles</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <article 
                  key={product.product_id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-6xl">📦</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[#1e293b] line-clamp-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-2xl font-bold text-[#6ee7b7]">
                          ${product.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">
                          Stock: {product.stock} unidades
                        </p>
                      </div>
                      <button 
                        onClick={() => initiatePurchase(product)}
                        className="bg-[#6ee7b7] text-[#1e293b] px-4 py-2 rounded-lg hover:bg-[#5dd6a6] transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Comprar ${product.name}`}
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? 'Comprar' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="bg-[#6ee7b7] text-[#1e293b] px-8 py-3 rounded-lg hover:bg-[#5dd6a6] transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Ver más productos
                </button>
              </div>
            )}

            {/* Purchase Confirmation Modal */}
            {selectedProduct && (
              <PurchaseModal
                product={selectedProduct}
                quantity={quantity}
                purchasing={purchasing}
                error={purchaseError}
                isOpen={!!selectedProduct}
                onClose={cancelPurchase}
                onConfirm={handlePurchaseConfirm}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                totalPrice={getTotalPrice()}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
