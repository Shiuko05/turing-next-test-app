'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

/**
 * Hook de autenticación para gestionar login, registro y cierre de sesión
 * 
 * @description Maneja todas las operaciones de autenticación con Supabase
 * incluyendo traducciones de errores al español y manejo de sesiones
 * 
 * @returns {Object} Funciones de autenticación y estados de carga/error
 */

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

interface User {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface AuthResponse {
  user?: User;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  error?: string;
}

// Función para traducir errores de Supabase
const translateSupabaseError = (error: string): string => {
  const errorMap: Record<string, string> = {
    'For security purposes, you can only request this after': 'Por razones de seguridad, debes esperar 30 segundos antes de intentar nuevamente.',
    'Email rate limit exceeded': 'Has excedido el límite de intentos. Por favor, espera unos minutos.',
    'Invalid login credentials': 'Credenciales inválidas. Verifica tu correo y contraseña.',
    'Email not confirmed': 'Por favor, confirma tu correo electrónico antes de iniciar sesión.',
    'User not found': 'Usuario no encontrado.',
    'Invalid email': 'Correo electrónico inválido.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'User already registered': 'Este correo ya está registrado.',
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return value;
    }
  }

  return error;
};

export function useAuth() {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  //POST - Función para iniciar sesión
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        const translatedError = translateSupabaseError(data.error || 'Error al iniciar sesión');
        throw new Error(translatedError);
      }

      // Establecer la sesión en el cliente de Supabase con soporte de cookies
      if (data.session) {
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionError) {
          throw new Error('Error al establecer la sesión');
        }
      }

      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  //POST - Función para registrarse  
  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          username: credentials.firstName,
          lastname: credentials.lastName,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        const translatedError = translateSupabaseError(data.error || 'Error al registrarse');
        throw new Error(translatedError);
      }

      // Redirigir a página de confirmación de email
      router.push(`/auth/confirm-email?email=${encodeURIComponent(credentials.email)}`);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  //POST - Función para cerrar sesión
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener sesión actual de Supabase
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      // Llamar al endpoint con el token
      if (session?.access_token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
      }

      // Limpiar sesión local de Supabase (incluyendo cookies)
      await supabase.auth.signOut();

      // Redirigir al inicio con recarga completa
      window.location.href = '/';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      console.error(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    isLoading,
    error,
  };
}
