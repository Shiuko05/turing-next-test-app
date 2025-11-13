'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
}

interface EditProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (productId: string, data: Partial<Product>) => Promise<void>;
  loading?: boolean;
}

export function EditProductDialog({ 
  product, 
  open, 
  onOpenChange, 
  onSave,
  loading = false 
}: EditProductDialogProps) {
  // Inicializar formData basado en el producto actual
  const getInitialFormData = () => ({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    description: product?.description || '',
    image_url: product?.image_url || '',
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actualizar formData cuando cambie el producto o se abra el diálogo
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image_url: product.image_url || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.product_id, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Crear URL temporal para preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Limpiar URL temporal cuando se cierre el diálogo
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      // Si hay un archivo seleccionado, incluirlo en los datos
      if (selectedFile) {
        // Crear un objeto que incluya el archivo
        const updateData = {
          ...formData,
          imageFile: selectedFile
        };
        await onSave(product.product_id, updateData);
      } else {
        await onSave(product.product_id, formData);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b] text-xl font-bold">Editar Producto</DialogTitle>
          <DialogDescription className="text-gray-600">
            Realiza cambios en el producto. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[#1e293b] font-medium">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-[#1e293b] font-medium">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-[#1e293b] font-medium">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock" className="text-[#1e293b] font-medium">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                  className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[#1e293b] font-medium">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[#1e293b] font-medium">Imagen del Producto</Label>
              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="border-gray-300 text-[#1e293b] hover:bg-gray-50 cursor-pointer"
                >
                  Cambiar imagen
                </Button>
                {selectedFile && previewUrl ? (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded border border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : formData.image_url ? (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Image 
                      src={formData.image_url} 
                      alt="Imagen actual" 
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded border border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.image_url.split('/').pop()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Imagen actual del producto
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay imagen seleccionada</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#6ee7b7] text-[#1e293b] hover:bg-[#5dd6a6] font-semibold cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
