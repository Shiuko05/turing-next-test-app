'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { useAdminData } from '@/hooks/useAdminData';
import { useAdminActions } from '@/hooks/useAdminActions';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EditProductDialog } from "@/components/admin/EditProductDialog";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { CreateProductDialog } from "@/components/admin/CreateProductDialog";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Users, Edit, Trash2, Plus, Power } from "lucide-react";

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
  status?: number;
}

interface User {
  user_id: string;
  username: string;
  lastname: string;
  email: string;
  role: string;
  created_at: string;
}

interface CreateProductData {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  imageFile?: File;
}

interface CreateUserData {
  username: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  email_confirm: boolean;
}

export default function AdminPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  // Verificar si es admin
  const isAdmin = user?.role === 'admin' || user?.user_metadata?.role === 'admin';
  
  // Obtener datos del hook - actualizar cuando refreshTrigger cambie
  const { productos, pedidos, usuarios, loading: loadingData } = useAdminData(isAdmin);
  
  // Hook para acciones de admin
  const { updateProduct, deactivateProduct, updateUser, deleteUser, createProduct, createUser, loading: actionLoading } = useAdminActions();
  
  // Estados para los diálogos
  const [editProductDialog, setEditProductDialog] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
  
  const [editUserDialog, setEditUserDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'product' | 'user' | null;
    id: string | null;
    name: string;
  }>({
    open: false,
    type: null,
    id: null,
    name: '',
  });
  
  const [createProductDialog, setCreateProductDialog] = useState(false);
  const [createUserDialog, setCreateUserDialog] = useState(false);

  // Handlers para productos
  const handleEditProduct = (product: Product) => {
    setEditProductDialog({ open: true, product });
  };

  const handleSaveProduct = async (productId: string, data: Partial<Product>) => {
    try {
      await updateProduct(productId, data);
      setEditProductDialog({ open: false, product: null });
      toast.success('Producto actualizado exitosamente');
      // Recargar página para obtener datos actualizados
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar producto');
    }
  };

  const handleDeleteProductClick = (productId: string, productName: string) => {
    setDeleteDialog({
      open: true,
      type: 'product',
      id: productId,
      name: productName,
    });
  };

  const handleCreateProduct = async (data: CreateProductData) => {
    try {
      await createProduct(data);
      setCreateProductDialog(false);
      toast.success('Producto creado exitosamente');
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear producto');
    }
  };

  // Handlers para usuarios
  const handleEditUser = (usuario: User) => {
    setEditUserDialog({ open: true, user: usuario });
  };

  const handleSaveUser = async (userId: string, data: Partial<User>) => {
    try {
      await updateUser(userId, data);
      setEditUserDialog({ open: false, user: null });
      toast.success('Usuario actualizado exitosamente');
      // Recargar página para obtener datos actualizados
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar usuario');
    }
  };

  const handleDeleteUserClick = (userId: string, userName: string) => {
    setDeleteDialog({
      open: true,
      type: 'user',
      id: userId,
      name: userName,
    });
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      await createUser(data);
      setCreateUserDialog(false);
      toast.success('Usuario creado exitosamente');
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear usuario');
    }
  };

  // Handler para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    try {
      if (deleteDialog.type === 'product') {
        await deactivateProduct(deleteDialog.id);
        toast.success('Producto desactivado exitosamente');
      } else {
        await deleteUser(deleteDialog.id);
        toast.success('Usuario eliminado exitosamente');
      }
      
      setDeleteDialog({ open: false, type: null, id: null, name: '' });
      // Recargar página para obtener datos actualizados
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  // Verificar si el usuario es admin y redirigir si no lo es
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#6ee7b7] border-r-transparent"></div>
            <p className="text-[#1e293b] font-medium">Verificando acceso...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No renderizar si no es admin
  if (!user || (user.role !== 'admin' && user.user_metadata?.role !== 'admin')) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getRolLabel = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Cliente';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Header del Panel */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona productos, pedidos y usuarios de TuringStore
          </p>
        </div>

        {/* Loading State - Mostrar antes de los tabs */}
        {loadingData ? (
          <div className="space-y-6">
            {/* Tabs skeleton */}
            <div className="animate-pulse">
              <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>

            {/* Contenido skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse space-y-4">
                {/* Header skeleton */}
                <div className="flex justify-between items-center mb-6">
                  <div className="h-7 bg-gray-300 rounded w-48"></div>
                  <div className="h-10 bg-gray-300 rounded w-40"></div>
                </div>
                
                {/* Tabla skeleton - Desktop */}
                <div className="hidden md:block space-y-3">
                  {/* Header de tabla */}
                  <div className="grid grid-cols-5 gap-4 pb-3 border-b">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                  
                  {/* Filas de tabla */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                      <div className="h-4 bg-gray-300 rounded w-28"></div>
                      <div className="flex gap-2">
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cards skeleton - Mobile */}
                <div className="md:hidden space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-4 w-4 bg-gray-300 rounded"></div>
                          <div className="h-4 w-4 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tabs con contenido real
          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="productos" className="flex items-center gap-2 cursor-pointer">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Productos</span>
                <span className="sm:hidden">Prod.</span>
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {productos.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="flex items-center gap-2 cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Pedidos</span>
                <span className="sm:hidden">Ped.</span>
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {pedidos.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="flex items-center gap-2 cursor-pointer">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Usuarios</span>
                <span className="sm:hidden">Users</span>
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {usuarios.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content: Productos */}
            <TabsContent value="productos" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#1e293b]">
                      Gestión de Productos
                    </h2>
                    <button 
                      onClick={() => setCreateProductDialog(true)}
                      className="flex items-center gap-2 bg-[#6ee7b7] text-[#1e293b] px-4 py-2 rounded-lg hover:bg-[#5dd6a6] transition-colors font-medium cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Nuevo Producto</span>
                      <span className="sm:hidden">Nuevo</span>
                    </button>
                  </div>

                  {productos.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay productos registrados</p>
                  ) : (
                    <>
                      {/* Tabla Responsive - Mobile: Cards, Desktop: Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {productos.map((producto) => (
                              <tr key={producto.product_id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.name}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{producto.category}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-[#6ee7b7]">${producto.price}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{producto.stock} unidades</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  {producto.status === 0 ? (
                                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Desactivado</span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Activo</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  <div className="flex gap-4">
                                    <button 
                                      onClick={() => handleEditProduct(producto)}
                                      className="text-blue-600 hover:text-blue-800 cursor-pointer" 
                                      aria-label="Editar"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProductClick(producto.product_id, producto.name)}
                                      className="text-red-600 hover:text-red-800 cursor-pointer" 
                                      aria-label="Eliminar"
                                    >
                                      <Power className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Vista Mobile - Cards */}
                      <div className="md:hidden space-y-4">
                        {productos.map((producto) => (
                          <div key={producto.product_id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-[#1e293b]">{producto.name}</h3>
                                <p className="text-sm text-gray-500">{producto.category}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${producto.status === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{producto.status === 0 ? 'Desactivado' : 'Activo'}</span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditProduct(producto)}
                                  className="text-blue-600 hover:text-blue-800" 
                                  aria-label="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProductClick(producto.product_id, producto.name)}
                                  className="text-red-600 hover:text-red-800" 
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-[#6ee7b7]">${producto.price}</span>
                              <span className="text-sm text-gray-600">{producto.stock} en stock</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                </div>
              </TabsContent>

          {/* Tab Content: Pedidos */}
          <TabsContent value="pedidos" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
                Gestión de Pedidos
              </h2>

              {pedidos.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay pedidos registrados</p>
              ) : (
                <>
                  {/* Tabla Responsive */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pedidos.map((pedido) => (
                          <tr key={pedido.purchase_id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {pedido.users ? `${pedido.users.username ?? ''} ${pedido.users.lastname ?? ''}` : 'Sin usuario'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {pedido.products?.name ?? 'Sin producto'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.quantity} unidades</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-[#6ee7b7]">${pedido.total_price}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(pedido.purchase_date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vista Mobile - Cards */}
                  <div className="md:hidden space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.purchase_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-[#1e293b]">{pedido.products?.name ?? 'Sin producto'}</h3>
                          <p className="text-sm text-gray-500">
                            {pedido.users ? `${pedido.users.username ?? ''} ${pedido.users.lastname ?? ''}` : 'Sin usuario'}
                          </p>
                        </div>
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">{pedido.quantity} unidades</p>
                          <p className="text-sm text-gray-600">{formatDate(pedido.purchase_date)}</p>
                        </div>
                        <div className="text-lg font-bold text-[#6ee7b7]">${pedido.total_price}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            </div>
          </TabsContent>

          {/* Tab Content: Usuarios */}
          <TabsContent value="usuarios" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#1e293b]">
                  Gestión de Usuarios
                </h2>
                <button 
                  onClick={() => setCreateUserDialog(true)}
                  className="flex items-center gap-2 bg-[#6ee7b7] text-[#1e293b] px-4 py-2 rounded-lg hover:bg-[#5dd6a6] transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo Usuario</span>
                  <span className="sm:hidden">Nuevo</span>
                </button>
              </div>

              {usuarios.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay usuarios registrados</p>
              ) : (
                <>
                  {/* Tabla Responsive */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.map((usuario) => (
                          <tr key={usuario.user_id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {usuario.username} {usuario.lastname}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(usuario.created_at)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                usuario.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {getRolLabel(usuario.role)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditUser(usuario)}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer" 
                                  aria-label="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUserClick(usuario.user_id, `${usuario.username} ${usuario.lastname}`)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer" 
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vista Mobile - Cards */}
                  <div className="md:hidden space-y-4">
                    {usuarios.map((usuario) => (
                      <div key={usuario.user_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1e293b]">
                              {usuario.username} {usuario.lastname}
                            </h3>
                            <p className="text-sm text-gray-500">{usuario.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditUser(usuario)}
                              className="text-blue-600 hover:text-blue-800" 
                              aria-label="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUserClick(usuario.user_id, `${usuario.username} ${usuario.lastname}`)}
                              className="text-red-600 hover:text-red-800" 
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Desde {formatDate(usuario.created_at)}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            usuario.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getRolLabel(usuario.role)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </main>

      {/* Diálogos */}
      <EditProductDialog
        product={editProductDialog.product}
        open={editProductDialog.open}
        onOpenChange={(open) => setEditProductDialog({ open, product: null })}
        onSave={handleSaveProduct}
        loading={actionLoading}
      />

      <EditUserDialog
        user={editUserDialog.user}
        open={editUserDialog.open}
        onOpenChange={(open) => setEditUserDialog({ open, user: null })}
        onSave={handleSaveUser}
        loading={actionLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleConfirmDelete}
        title={`Eliminar ${deleteDialog.type === 'product' ? 'Producto' : 'Usuario'}`}
        description={`¿Estás seguro de que deseas eliminar "${deleteDialog.name}"? Esta acción no se puede deshacer.`}
        loading={actionLoading}
      />

      <CreateProductDialog
        open={createProductDialog}
        onOpenChange={setCreateProductDialog}
        onCreate={handleCreateProduct}
        loading={actionLoading}
      />

      <CreateUserDialog
        open={createUserDialog}
        onOpenChange={setCreateUserDialog}
        onCreate={handleCreateUser}
        loading={actionLoading}
      />

      <Footer />
    </div>
  );
}
