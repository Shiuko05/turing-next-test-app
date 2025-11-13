import Image from 'next/image';
import { ShoppingCart, Package, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
}

interface PurchaseModalProps {
  product: Product;
  quantity: number;
  purchasing: boolean;
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  totalPrice: number;
}

export default function PurchaseModal({
  product,
  quantity,
  purchasing,
  error,
  isOpen,
  onClose,
  onConfirm,
  onIncrement,
  onDecrement,
  totalPrice,
}: PurchaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-white border-gray-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#6ee7b7] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#1e293b]" />
            </div>
            <div>
              <DialogTitle className="text-[#1e293b] text-xl font-bold">Confirmar Compra</DialogTitle>
              <DialogDescription className="text-gray-600">
                Revisa los detalles antes de confirmar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Product Details */}
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center shrink-0">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <Package className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#1e293b] mb-1">{product.name}</h4>
              <p className="text-xs text-gray-500 uppercase">{product.category}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-[#1e293b]">Cantidad:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={onDecrement}
                className="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-lg font-semibold text-[#1e293b] w-12 text-center">{quantity}</span>
              <button
                onClick={onIncrement}
                className="w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Precio unitario:</span>
              <span className="font-medium text-[#1e293b]">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cantidad:</span>
              <span className="font-medium text-[#1e293b]">{quantity}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-semibold text-[#1e293b]">Total:</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-[#6ee7b7]" />
                <span className="text-2xl font-bold text-[#6ee7b7]">
                  {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            Stock disponible: {product.stock} unidades
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">❌ {error}</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={purchasing}
            className="border-gray-300 text-[#1e293b] hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={purchasing}
            className="bg-[#6ee7b7] text-[#1e293b] hover:bg-[#5dd6a6] font-semibold"
          >
            {purchasing ? 'Procesando...' : 'Confirmar Compra'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
