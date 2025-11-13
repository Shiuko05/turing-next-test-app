'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { User, Package, LogOut, Settings } from "lucide-react";

/**
 * Componente Header
 * 
 * @description Barra de navegación principal con logo, menú de usuario
 * y modales de perfil y compras. Muestra opciones diferentes según rol
 */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileModal from "./ProfileModal";
import PurchasedProductsModal from "./PurchasedProductsModal";

export default function Header() {
  const { user, loading } = useUser();
  const { logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPurchasedModalOpen, setIsPurchasedModalOpen] = useState(false);

  // Obtener username y role directamente
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || '';
  const userRole = user?.role || user?.user_metadata?.role;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-[#1e293b] text-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex gap-2 items-center cursor-pointer" aria-label="Home">
              <Image 
                src="/uploads/avatar/white-logo.png" 
                alt="Logo" 
                width={50} 
                height={50}
                priority
              />
              <p className="text-lg font-semibold hidden md:block">TuringStore</p>
            </Link>
          </div>
          <div className="flex gap-2 lg:gap-3 items-center">
            
            {/* Saludo de usuario autenticado - visible en móvil y desktop */}
            {!loading && user && userName && (
              <span className="text-[#6ee7b7] font-medium">
                ¡Hola {userName}!
              </span>
            )}
            
            {/* User Button - Login o Menú según estado de autenticación */}
            {!loading && (
              user ? (
                // Menú desplegable cuando está autenticado
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="w-10 h-10 rounded-full bg-[#6ee7b7] flex items-center justify-center hover:bg-[#5dd6a6] transition-colors outline-none cursor-pointer"
                      aria-label="Menú de usuario"
                    >
                      <User className="w-5 h-5 text-[#1e293b]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1e293b] border-[#64748b] text-white">
                    <DropdownMenuItem 
                      onClick={() => setIsProfileModalOpen(true)}
                      className="hover:bg-[#334155] focus:bg-[#334155] focus:text-white cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsPurchasedModalOpen(true)}
                      className="hover:bg-[#334155] focus:bg-[#334155] focus:text-white cursor-pointer"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Mis Compras
                    </DropdownMenuItem>
                    
                    {/* Mostrar Panel de Admin solo si el rol es admin */}
                    {userRole === 'admin' && (
                      <>
                        <DropdownMenuSeparator className="bg-[#64748b]" />
                        <DropdownMenuItem asChild className="hover:bg-[#334155] focus:bg-[#334155] focus:text-white">
                          <Link href="/admin" className="cursor-pointer flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Panel de Admin
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator className="bg-[#64748b]" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-[#334155] focus:bg-[#334155] text-red-400 hover:text-red-300 focus:text-red-300">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Botón de login cuando NO está autenticado
                <Link 
                  href="/login"
                  className="w-10 h-10 rounded-full bg-[#6ee7b7] flex items-center justify-center hover:bg-[#5dd6a6] transition"
                  aria-label="Iniciar Sesión"
                >
                  <User className="w-5 h-5 text-[#1e293b]" />
                </Link>
              )
            )}
          </div>
        </nav>
      </div>

      {/* Modals */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      <PurchasedProductsModal 
        isOpen={isPurchasedModalOpen} 
        onClose={() => setIsPurchasedModalOpen(false)} 
      />
    </header>
  );
}
