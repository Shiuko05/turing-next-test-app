/**
 * Utilidades para trabajar con JWT tokens de Supabase
 * Incluye funciones para extraer custom claims como el rol de usuario
 */

interface JWTPayload {
  user_role?: string;
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decodifica un JWT y retorna el payload
 * No valida la firma, solo decodifica el contenido
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // El JWT tiene 3 partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT malformado');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    
    return payload as JWTPayload;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Extrae el rol de usuario del JWT
 * Retorna 'user' por defecto si no encuentra el rol
 */
export function getUserRoleFromToken(token: string): string {
  const payload = decodeJWT(token);
  return payload?.user_role || 'user';
}

/**
 * Verifica si un token ha expirado
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;

  // exp está en segundos, Date.now() en milisegundos
  return payload.exp * 1000 < Date.now();
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(token: string, role: string): boolean {
  const userRole = getUserRoleFromToken(token);
  return userRole === role;
}

/**
 * Verifica si el usuario es administrador
 */
export function isAdmin(token: string): boolean {
  return hasRole(token, 'admin');
}
