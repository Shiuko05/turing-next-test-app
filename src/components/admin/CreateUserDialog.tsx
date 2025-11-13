'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import { Checkbox } from "@/components/ui/checkbox";

interface CreateUserData {
  username: string;
  lastname: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  email_confirm: boolean;
}

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateUserData) => Promise<void>;
  loading?: boolean;
}

export function CreateUserDialog({ 
  open, 
  onOpenChange, 
  onCreate,
  loading = false 
}: CreateUserDialogProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user',
    email_confirm: false,
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form cuando se cierra
      setFormData({
        username: '',
        lastname: '',
        email: '',
        password: '',
        role: 'user',
        email_confirm: false,
      });
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar contraseña
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await onCreate(formData);
      handleOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b] text-xl font-bold">Crear Nuevo Usuario</DialogTitle>
          <DialogDescription className="text-gray-600">
            Completa los datos del nuevo usuario. Todos los campos son requeridos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-[#1e293b] font-medium">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                placeholder="Ej: Juan"
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname" className="text-[#1e293b] font-medium">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                required
                placeholder="Ej: Pérez"
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[#1e293b] font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="usuario@ejemplo.com"
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-[#1e293b] font-medium">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]"
              />
              <p className="text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-[#1e293b] font-medium">
                Rol <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'user' | 'admin') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="border-gray-300 focus:border-[#6ee7b7] focus:ring-[#6ee7b7]">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="user" className="hover:bg-gray-50 focus:bg-gray-50">Cliente</SelectItem>
                  <SelectItem value="admin" className="hover:bg-gray-50 focus:bg-gray-50">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                id="email_confirm"
                checked={formData.email_confirm}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, email_confirm: checked === true })
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label 
                  htmlFor="email_confirm" 
                  className="text-sm font-medium text-[#1e293b] cursor-pointer"
                >
                  Requerir confirmación de email
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Si se activa, el usuario recibirá un correo de confirmación. 
                  Si no, la cuenta estará activa inmediatamente.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="border-gray-300 text-[#1e293b] hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#6ee7b7] text-[#1e293b] hover:bg-[#5dd6a6] font-semibold"
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
