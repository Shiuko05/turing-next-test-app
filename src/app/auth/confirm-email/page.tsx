'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, RotateCw } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

const RESEND_COOLDOWN = 60; // segundos

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const supabase = createClient();

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      setMessage('No se proporcionó un email válido');
      return;
    }

    if (cooldown > 0) {
      return;
    }

    setIsResending(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        // Traducir errores comunes de Supabase
        let errorMsg = error.message;
        
        if (error.message.includes('For security purposes')) {
          errorMsg = 'Por seguridad, debes esperar 60 segundos antes de reenviar.';
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMsg = 'Has excedido el límite de reenvíos. Intenta más tarde.';
        } else if (error.message.includes('Invalid email')) {
          errorMsg = 'El correo electrónico no es válido.';
        } else if (error.message.includes('User not found')) {
          errorMsg = 'No se encontró el usuario con este correo.';
        }
        
        setMessage('Error: ' + errorMsg);
      } else {
        setMessage('✓ Email reenviado exitosamente. Revisa tu bandeja de entrada.');
        setCooldown(RESEND_COOLDOWN); // Reiniciar cooldown
      }
    } catch {
      setMessage('Error al reenviar el correo. Intenta nuevamente.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#6ee7b7] flex items-center justify-center">
              <Mail className="w-10 h-10 text-[#1e293b]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1e293b] mb-4">
            Confirma tu correo electrónico
          </h1>

          {/* Email */}
          {email && (
            <p className="text-gray-600 mb-2">
              Enviamos un enlace de confirmación a:
            </p>
          )}
          <p className="text-[#6ee7b7] font-semibold text-lg mb-6">
            {email || 'tu correo electrónico'}
          </p>

          {/* Instructions */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pasos a seguir:</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Abre tu bandeja de entrada</li>
              <li>Busca el correo de confirmación</li>
              <li>Haz clic en el enlace de verificación</li>
              <li>¡Listo! Ya puedes iniciar sesión</li>
            </ol>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.startsWith('✓') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="w-full bg-[#6ee7b7] text-[#1e293b] font-semibold py-3 px-4 rounded-lg hover:bg-[#5dd6a6] transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 flex items-center justify-center gap-2 mb-4"
          >
            {isResending ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                Reenviando...
              </>
            ) : cooldown > 0 ? (
              <>
                <RotateCw className="w-4 h-4" />
                Espera {cooldown}s para reenviar
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                Reenviar correo
              </>
            )}
          </button>

          {/* Help text */}
          <p className="text-sm text-gray-500 mb-4">
            ¿No encuentras el correo? Revisa tu carpeta de <strong>spam</strong> o correo no deseado.
          </p>

          {/* Back to login */}
          <Link 
            href="/login"
            className="text-sm text-[#1e293b] hover:text-[#6ee7b7] transition font-medium"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
