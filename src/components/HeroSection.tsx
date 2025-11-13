export default function HeroSection() {
  return (
    <section className="bg-[#1e293b] text-white py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-[#64748b] rounded mx-auto"></div>
            <div className="h-6 w-2/3 bg-[#64748b] rounded mx-auto"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#475569] rounded mx-auto"></div>
            <div className="h-4 w-5/6 bg-[#475569] rounded mx-auto"></div>
          </div>
          <div>
            <div className="h-12 w-40 bg-[#6ee7b7] rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
