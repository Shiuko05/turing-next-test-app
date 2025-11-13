export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#6ee7b7] border-r-transparent"></div>
        <p className="text-[#1e293b] font-medium">Cargando...</p>
      </div>
    </div>
  );
}
