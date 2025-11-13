'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  user_id: string;
  username: string;
  lastname: string;
  email: string;
  role: string;
}

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, data: Partial<User>) => Promise<void>;
  loading?: boolean;
}

export function EditUserDialog({ 
  user, 
  open, 
  onOpenChange, 
  onSave,
  loading = false 
}: EditUserDialogProps) {
  // Inicializar formData basado en el usuario actual
  const getInitialFormData = () => ({
    username: user?.username || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    role: (user?.role || 'user') as 'user' | 'admin',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Actualizar formData cuando cambie el usuario o se abra el diálogo
  useEffect(() => {
    if (user && open) {
      setFormData({
        username: user.username,
        lastname: user.lastname,
        email: user.email,
        role: user.role as 'user' | 'admin',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await onSave(user.user_id, formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b] text-xl font-bold">Editar Usuario</DialogTitle>
          <DialogDescription className="text-gray-600">
            Realiza cambios en el usuario. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-[#1e293b] font-medium">Nombre</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
                required
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname" className="text-[#1e293b] font-medium">Apellido</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastname: e.target.value })}
                required
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[#1e293b] font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-[#1e293b] font-medium">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'user' | 'admin') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7] cursor-pointer">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="user" className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">Cliente</SelectItem>
                  <SelectItem value="admin" className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#6ee7b7] text-[#1e293b] hover:bg-[#5dd6a6] font-semibold cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
