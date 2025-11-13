export default function TeamSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-6 w-48 bg-gray-300 rounded mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[1, 2, 3].map((item, index) => (
            <div key={item} className="text-center">
              <div 
                className={`w-32 h-32 rounded-full mx-auto mb-4 ${
                  index === 1 ? 'bg-[#1e293b] w-40 h-40' : 'bg-[#1e293b]'
                }`}
              ></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
                <div className="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
