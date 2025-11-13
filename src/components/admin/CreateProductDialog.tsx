'use client';

import { useState, useRef, useEffect } from 'react';
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

interface CreateProductData {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  imageFile?: File;
}

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateProductData) => Promise<void>;
  loading?: boolean;
}

export function CreateProductDialog({ 
  open, 
  onOpenChange, 
  onCreate,
  loading = false 
}: CreateProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form cuando se cierra
      setFormData({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
      });
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
    onOpenChange(newOpen);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Limpiar URL temporal
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createData: CreateProductData = {
        ...formData,
        ...(selectedFile && { imageFile: selectedFile })
      };
      
      await onCreate(createData);
      handleOpenChange(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b] text-xl font-bold">Crear Nuevo Producto</DialogTitle>
          <DialogDescription className="text-gray-600">
            Completa los datos del nuevo producto. Todos los campos son requeridos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[#1e293b] font-medium">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: Laptop Dell Inspiron"
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-[#1e293b] font-medium">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="Ej: Electrónica"
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-[#1e293b] font-medium">
                  Precio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                  placeholder="0.00"
                  className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock" className="text-[#1e293b] font-medium">
                  Stock <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  required
                  placeholder="0"
                  className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[#1e293b] font-medium">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Descripción del producto..."
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
                  {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </Button>
                {selectedFile && previewUrl && (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
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
              {loading ? 'Creando...' : 'Crear producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
