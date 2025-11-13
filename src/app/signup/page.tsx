'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { signup, isLoading, error } = useAuth();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (!userLoading && user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    // Prevenir registro si ya está autenticado
    if (user) {
      return;
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    try {
      await signup({ 
        email, 
        password, 
        firstName: username, 
        lastName: lastname 
      });
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-[#1e293b] flex items-center justify-center">
          <div className="text-white text-lg">Cargando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // No renderizar el formulario si está autenticado
  if (user) {
    return null;
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
                Crear Cuenta
              </h1>
              <p className="text-gray-600">
                Completa el formulario para registrarte
              </p>
            </div>

            {/* Error Messages */}
            {(error || validationError) && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{validationError || error}</p>
              </div>
            )}

            {/* Register Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name and Last Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="firstName" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ee7b7] focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label 
                    htmlFor="lastName" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Apellidos
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ee7b7] focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Pérez García"
                  />
                </div>
              </div>

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

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <a 
                  href="/login" 
                  className="text-[#1e293b] font-semibold hover:text-[#6ee7b7] transition"
                >
                  Inicia Sesión
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
