import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras mayores a $500',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía de Satisfacción',
    description: '30 días para devoluciones',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Atención personalizada',
  },
  {
    icon: CreditCard,
    title: 'Pagos Seguros',
    description: 'Protección en todas tus compras',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e293b]">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-gray-600 mt-2">
            Beneficios que hacen la diferencia
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white text-center p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-[#6ee7b7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#1e293b]" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
