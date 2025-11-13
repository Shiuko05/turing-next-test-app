export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-6 w-48 bg-gray-300 rounded mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item, index) => (
            <div key={item} className="text-center">
              <div 
                className={`h-32 rounded-lg mx-auto mb-4 ${
                  index < 2 ? 'bg-[#6ee7b7]' : 'bg-[#6ee7b7] opacity-40'
                }`}
                style={index >= 2 ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, #6ee7b7, #6ee7b7 10px, #5dd6a6 10px, #5dd6a6 20px)'
                } : {}}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
