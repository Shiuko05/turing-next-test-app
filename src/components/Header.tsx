export default function Header() {
  return (
    <header className="bg-[#1e293b] text-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-20 sm:h-10 sm:w-24 bg-[#334155] rounded"></div>
          </div>
          <div className="hidden md:flex gap-4 lg:gap-8 items-center">
            <div className="h-4 w-16 lg:w-20 bg-[#64748b] rounded">
            </div>
            <div className="h-4 w-16 lg:w-20 bg-[#64748b] rounded"></div>
            <div className="h-4 w-16 lg:w-20 bg-[#64748b] rounded"></div>
            <div className="h-4 w-16 lg:w-20 bg-[#64748b] rounded"></div>
            
            {/* Login Button */}
            <a 
              href="/login"
              className="w-10 h-10 rounded-full bg-[#6ee7b7] flex items-center justify-center hover:bg-[#5dd6a6] transition"
              aria-label="Iniciar Sesión"
            >
              <svg className="w-5 h-5 text-[#1e293b]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden flex flex-col gap-1.5 p-2">
            <div className="h-0.5 w-6 bg-white rounded"></div>
            <div className="h-0.5 w-6 bg-white rounded"></div>
            <div className="h-0.5 w-6 bg-white rounded"></div>
          </button>
        </nav>
      </div>
    </header>
  );
}
