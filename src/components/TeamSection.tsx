'use client';

import { useTopBuyers } from '@/hooks/useTopBuyers';

export default function TeamSection() {
  const { topBuyers, loading } = useTopBuyers();

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 w-80 bg-gray-300 rounded mx-auto mb-3 animate-pulse"></div>
            <div className="h-5 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="text-center">
                <div 
                  className={`${index === 1 ? 'w-40 h-40' : 'w-32 h-32'} bg-gray-300 rounded-full mx-auto mb-6 animate-pulse`}
                ></div>
                <div className="space-y-3">
                  <div className="h-1.5 bg-gray-300 w-20 mx-auto rounded animate-pulse"></div>
                  <div className="h-5 w-40 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  <div className="h-4 w-28 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (topBuyers.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e293b]">
              Clientes Destacados
            </h2>
            <p className="text-lg text-gray-600 mt-3">
              Los compradores más activos de nuestra tienda
            </p>
          </div>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">👥</span>
            <p className="text-gray-500 text-lg">No hay compras registradas aún</p>
          </div>
        </div>
      </section>
    );
  }

  const getInitials = (username: string, lastname: string) => {
    const firstInitial = username?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastname?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || '??';
  };

  const getFullName = (username: string, lastname: string) => {
    if (!username && !lastname) return 'Usuario Anónimo';
    if (!username) return lastname;
    if (!lastname) return username;
    return `${username} ${lastname}`;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1e293b]">
            Clientes Destacados
          </h2>
          <p className="text-lg text-gray-600 mt-3">
            Los compradores más activos de nuestra tienda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {topBuyers.map((buyer, index) => {
            // El primero (más compras) va en el centro en desktop
            const position = index === 0 ? 1 : index === 1 ? 0 : 2;
            const isCenter = position === 1;
            
            return (
              <div 
                key={buyer.user_id} 
                className={`text-center transform transition-all hover:scale-105 ${isCenter ? 'md:-mt-4' : ''}`}
                style={{ order: position }}
              >
                <div 
                  className={`${isCenter ? 'w-40 h-40 text-4xl' : 'w-32 h-32 text-3xl'} bg-linear-to-br from-[#1e293b] to-[#334155] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                >
                <span className="text-white font-bold">
                  {getInitials(buyer.username, buyer.lastname)}
                </span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 bg-[#6ee7b7] w-20 mx-auto rounded"></div>
                <p className="text-lg font-semibold text-[#1e293b]">
                  {getFullName(buyer.username, buyer.lastname)}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {buyer.purchase_count} {buyer.purchase_count === 1 ? 'compra realizada' : 'compras realizadas'}
                </p>
                <p className="text-base font-bold text-[#6ee7b7]">
                  ${buyer.total_spent.toFixed(2)} total gastado
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
