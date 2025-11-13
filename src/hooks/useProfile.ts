'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

/**
 * Hook para actualizar el perfil del usuario
 * 
 * @description Permite actualizar nombre y apellido del usuario
 * mediante petición PUT a /api/users/[id]
 * 
 * @returns {Object} Estado de actualización y función updateProfile
 */

interface UpdateProfileData {
  username: string;
  lastname: string;
}

export function useProfile() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; message?: string; error?: string }> => {
    setUpdating(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { success: false, error: 'No hay sesión activa' };
      }

      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el perfil');
      }

      return { success: true, message: 'Perfil actualizado correctamente' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    error,
    updateProfile,
  };
}
