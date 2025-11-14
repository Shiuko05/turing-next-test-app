'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
}

interface User {
  user_id: string;
  username: string;
  lastname: string;
  email: string;
  role: string;
}

export function useAdminActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // Actualizar producto
  const updateProduct = async (productId: string, data: Partial<Product> & { imageFile?: File }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No hay token de sesión');

      let finalData = { ...data };
      
      // Si hay un archivo de imagen, subirlo primero
      if (data.imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', data.imageFile);

        const uploadResponse = await fetch('/api/upload/products', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }

        const uploadData = await uploadResponse.json();
        finalData = { ...data, image_url: uploadData.url };
        delete finalData.imageFile;
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Desactivar producto
  const deactivateProduct = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No hay token de sesión');

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 0 })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al desactivar producto');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario
  const updateUser = async (userId: string, data: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No hay token de sesión');

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No hay token de sesión');

      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar usuario');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProduct = async (data: Omit<Product, 'product_id'> & { imageFile?: File }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No hay token de sesión');

      let finalData = { ...data };
      
      // Si hay un archivo de imagen, subirlo primero
      if (data.imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', data.imageFile);

        const uploadResponse = await fetch('/api/upload/products', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }

        const uploadData = await uploadResponse.json();
        finalData = { ...data, image_url: uploadData.url };
        delete finalData.imageFile;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear producto');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (data: { 
    username: string; 
    lastname: string; 
    email: string; 
    password: string; 
    role: string;
    email_confirm: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No hay token de sesión');

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProduct,
    deactivateProduct,
    updateUser,
    deleteUser,
    createProduct,
    createUser,
    loading,
    error,
  };
}
