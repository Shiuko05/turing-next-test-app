export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-48 bg-[#6ee7b7] rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
