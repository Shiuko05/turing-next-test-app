'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (!userLoading && user && !isLoading) {
      router.push('/');
    }
  }, [user, userLoading, router, isLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevenir login si ya está autenticado
    if (user) {
      return;
    }
    
    try {
      await login({ email, password });
      // Dar un momento para que la sesión se establezca
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (err) {
      // El error ya está manejado en el hook
      console.error('Error en login:', err);
    }
  };

  // Mostrar loading mientras verifica autenticación o está autenticado
  if (userLoading || user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-[#1e293b] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#6ee7b7] border-r-transparent"></div>
            <p className="text-white text-lg">{user ? 'Redirigiendo...' : 'Cargando...'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#1e293b] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ee7b7] focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ee7b7] focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6ee7b7] text-[#1e293b] font-semibold py-3 px-4 rounded-lg hover:bg-[#5dd6a6] transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <a 
                  href="/signup" 
                  className="text-[#1e293b] font-semibold hover:text-[#6ee7b7] transition"
                >
                  Regístrate
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
