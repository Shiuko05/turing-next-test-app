'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useUser } from '@/hooks/useUser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { updating, error, updateProfile } = useProfile();
  const { user, loading } = useUser();
  const [formData, setFormData] = useState(() => ({
    username: user?.user_metadata?.username || user?.username || '',
    lastname: user?.user_metadata?.lastname || user?.lastname || '',
    email: user?.user_metadata?.email || user?.email || '',
  }));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const firstLoadRef = useRef(true);

    useEffect(() => {
    if (!user) return;

    // Solo permitir sincronizar la primera vez que llega user
    if (firstLoadRef.current) {
        firstLoadRef.current = false;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
        username: user.user_metadata?.username || user.username || "",
        lastname: user.user_metadata?.lastname || user.lastname || "",
        email: user.user_metadata?.email || user.email || "",
        });

        setSuccessMessage(null);
    }
    }, [user]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const result = await updateProfile({
      username: formData.username,
      lastname: formData.lastname,
    });

    if (result.success) {
      setSuccessMessage(result.message || 'Perfil actualizado');
      setTimeout(() => {
        onClose();
        // El header y la modal se sincronizan automáticamente
      }, 1500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-white border-gray-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#6ee7b7] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#1e293b]" />
            </div>
            <div>
              <DialogTitle className="text-[#1e293b] text-xl font-bold">Mi Perfil</DialogTitle>
              <DialogDescription className="text-gray-600">
                Actualiza tu información personal
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Loading State */}
        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#6ee7b7] animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Email (Read-only) */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#1e293b] font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-300"
                />
                <p className="text-xs text-gray-500">El correo no se puede modificar</p>
              </div>

              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-[#1e293b] font-medium">
                  Nombre
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
                />
              </div>

              {/* Lastname */}
              <div className="grid gap-2">
                <Label htmlFor="lastname" className="text-[#1e293b] font-medium">
                  Apellido
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  required
                  className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">✅ {successMessage}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={updating}
                className="bg-[#6ee7b7] text-[#1e293b] hover:bg-[#5dd6a6] font-semibold"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin " />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
