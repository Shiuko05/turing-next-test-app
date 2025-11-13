import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#1e293b] text-white py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Encuentra los mejores productos en 
            <span className="text-[#6ee7b7]"> TuringStore</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Ofertas exclusivas, envío rápido y atención personalizada. 
            Tu tienda online de confianza.
          </p>
          <div className="pt-4">
            <Link 
              href="#productos"
              className="inline-block bg-[#6ee7b7] text-[#1e293b] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#5dd6a6] transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
