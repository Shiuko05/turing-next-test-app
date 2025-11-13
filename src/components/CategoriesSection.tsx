'use client';

import { useEffect, useState } from 'react';
import { 
  Laptop, 
  Headphones, 
  Smartphone, 
  Tablet, 
  HardDrive, 
  Watch, 
  Camera, 
  Tv, 
  Speaker, 
  Gamepad2,
  ShoppingBag,
  Home,
  Shirt,
  Sparkles,
  LucideIcon
} from 'lucide-react';

// Mapeo de categorías a iconos
const categoryIcons: Record<string, LucideIcon> = {
  'Electrónica': Laptop,
  'Electronica': Laptop,
  'Audio': Headphones,
  'Smartphones': Smartphone,
  'Smartphone': Smartphone,
  'Tablets': Tablet,
  'Tablet': Tablet,
  'Almacenamiento': HardDrive,
  'Accesorios': Watch,
  'Cámaras': Camera,
  'Camaras': Camera,
  'Televisores': Tv,
  'Bocinas': Speaker,
  'Gaming': Gamepad2,
  'Moda': Shirt,
  'Hogar': Home,
  'Tienda': ShoppingBag,
  'default': Sparkles,
};

interface Category {
  name: string;
  count: number;
  icon: LucideIcon;
}

export default function CategoriesSection() {
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Error al obtener productos');
        
        const data = await response.json();
        const products = data.products || [];

        // Contar productos por categoría
        const categoryCount: Record<string, number> = {};
        products.forEach((product: { category: string }) => {
          const category = product.category || 'Sin categoría';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        // Obtener las top 3 categorías
        const sortedCategories = Object.entries(categoryCount)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 3)
          .map(([name, count]) => ({
            name,
            count,
            icon: categoryIcons[name] || categoryIcons.default,
          }));

        setTopCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback a categorías por defecto
        setTopCategories([
          { name: 'Electrónica', count: 0, icon: Laptop },
          { name: 'Audio', count: 0, icon: Headphones },
          { name: 'Smartphones', count: 0, icon: Smartphone },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1e293b]">
            Las Mejores Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-48 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1e293b]">
          Las Mejores Categorías
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                className="h-48 bg-[#6ee7b7] rounded-lg hover:bg-[#5dd6a6] transition-colors flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
              >
                {/* Badge con contador */}
                <div className="absolute top-4 right-4 bg-[#1e293b] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {category.count} productos
                </div>
                
                <Icon 
                  className="w-16 h-16 text-[#1e293b] group-hover:scale-110 transition-transform" 
                  strokeWidth={1.5}
                />
                <span className="text-2xl font-semibold text-[#1e293b]">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
