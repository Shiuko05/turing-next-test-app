'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

interface UserWithRole extends User {
  role?: string;
  username?: string;
  lastname?: string;
  email?: string;
}

// Helper para extraer el rol del JWT
function getRoleFromJWT(user: User): string | null {
  try {
    // El rol está en los custom claims del JWT
    const session = user.app_metadata;
    return session?.user_role || null;
  } catch (error) {
    console.error('Error extrayendo rol del JWT:', error);
    return null;
  }
}

export function useUser() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual y sus datos
    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error || !authUser) {
          setUser(null);
        } else {
          // Intentar obtener el rol del JWT primero (más rápido)
          const jwtRole = getRoleFromJWT(authUser);
          
          // Obtener datos adicionales de la tabla users para username/lastname
          const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('username, lastname, role, email')
            .eq('user_id', authUser.id)
            .single();

          if (dbError) {
            console.error('Error al obtener datos del usuario:', dbError);
            // Usar solo datos de auth con rol del JWT
            setUser({
              ...authUser,
              role: jwtRole || 'user',
            });
          } else {
            // Combinar datos: priorizar rol del JWT, fallback al de BD
            setUser({
              ...authUser,
              user_metadata: {
                ...authUser.user_metadata,
                username: userData.username,
                lastname: userData.lastname,
                role: jwtRole || userData.role,
                email: userData.email,
              },
              role: jwtRole || userData.role, // JWT tiene prioridad
              username: userData.username,
              lastname: userData.lastname,
              email: userData.email,
            });
          }
          console.log('Usuario autenticado con rol:', jwtRole || userData?.role);
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading };
}
