'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function AuthConfirm() {
  const router = useRouter();
  const hasRun = useRef(false);
  const supabase = createClient();

  useEffect(() => {

    // Evitar que el efecto se ejecute más de una vez
    if (hasRun.current) return;
    hasRun.current = true;

    const handleAuth = async () => {
      // Verificar si hay tokens en el hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');

      if (access_token && refresh_token) {
        try {
          // Establecer la sesión con los tokens
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Error al establecer la sesión:', error);
            router.push('/auth/login?error=auth_failed');
          } else {
            console.log('✅ Sesión establecida correctamente');
            router.push('/');
          }
        } catch (err) {
          console.error('Error inesperado:', err);
          router.push('/auth/login?error=unexpected');
        }
      } else {
        // Si no hay tokens, verificar si hay una sesión activa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.push('/');
        } else {
          router.push('/auth/login?error=no_session');
        }
      }
    };

    handleAuth();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Confirmando tu cuenta...</h2>
        <p className="text-gray-600">Por favor espera un momento.</p>
      </div>
    </div>
  );
}