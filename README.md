# 🛍️ TuringStore - Plataforma E-commerce

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.81.1-green?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)

**Plataforma de comercio electrónico moderna con autenticación, gestión de productos y panel administrativo**

[Características](#-características-principales) • [Instalación](#-instalación-y-configuración) • [Arquitectura](#-arquitectura-del-proyecto) • [API](#-documentación-de-api) • [Base de Datos](#-diagrama-de-base-de-datos)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Diagrama de Base de Datos](#-diagrama-de-base-de-datos)
- [Flujos Principales](#-flujos-principales)
- [Documentación de API](#-documentación-de-api)
- [Scripts Disponibles](#-scripts-disponibles)
- [Variables de Entorno](#-variables-de-entorno)
- [Buenas Prácticas Implementadas](#-buenas-prácticas-implementadas)
- [Despliegue](#-despliegue)

---

## 🎯 Descripción General

**TuringStore** es una plataforma de comercio electrónico completa desarrollada con Next.js 16 y Supabase. El proyecto implementa un sistema robusto de autenticación, gestión de productos, carrito de compras y panel administrativo con roles de usuario.

### Objetivo del Proyecto

Proveer una solución e-commerce escalable y segura que permita:
- Gestión completa de productos con imágenes
- Sistema de autenticación con confirmación por email
- Roles de usuario (admin/usuario)
- Compras con control de inventario
- Panel administrativo
- Historial de compras por usuario

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- ✅ Registro con confirmación por email
- ✅ Inicio de sesión con JWT
- ✅ Gestión de sesiones con cookies seguras
- ✅ Roles de usuario (admin/user)
- ✅ Middleware de protección de rutas
- ✅ Actualización de perfil de usuario

### 🛒 Funcionalidades de Compra
- ✅ Catálogo de productos con paginación
- ✅ Filtros por categoría y precio
- ✅ Modal de confirmación de compra
- ✅ Control de stock en tiempo real
- ✅ Historial de compras
- ✅ Validación de inventario antes de comprar

### 👨‍💼 Panel Administrativo
- ✅ CRUD completo de productos
- ✅ CRUD completo de usuarios
- ✅ Gestión de imágenes de productos
- ✅ Activación/desactivación de productos
- ✅ Vista de pedidos

### 📊 Estadísticas y Reportes
- ✅ Top 3 clientes con más compras
- ✅ Total de productos y ventas
- ✅ Visualización de mejores compradores

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 16.0.1** - Framework React con SSR y App Router
- **React 19.2.0** - Librería de UI
- **TypeScript 5** - Tipado estático
- **TailwindCSS 4** - Estilos utility-first
- **Shadcn** - Componentes accesibles (Dialog, Dropdown, etc.)
- **Lucide React** - Iconos modernos

### Backend & Base de Datos
- **Supabase 2.81.1** - Backend como Servicio
  - PostgreSQL - Base de datos relacional
  - Auth - Sistema de autenticación
  - Storage - Almacenamiento
  - RLS Policies - Seguridad a nivel de fila
- **Next.js API Routes** - Endpoints RESTful

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **pnpm** - Gestor de paquetes

---

## 💻 Requisitos del Sistema

### Software Necesario
- **Node.js** >= 18.x (recomendado 20.x)
- **pnpm** >= 8.x (o npm/yarn)
- **Git** >= 2.x
- **Cuenta de Supabase** (gratis en [supabase.com](https://supabase.com))

### Conocimientos Previos Recomendados
- JavaScript/TypeScript
- React y Next.js
- PostgreSQL básico
- REST APIs

---

## 📦 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Shiuko05/turing-next-test-app.git
cd turing-next-test-app
```

### 2️⃣ Instalar Dependencias

```bash
# Usando pnpm (recomendado)
pnpm install

# O usando npm
npm install

# O usando yarn
yarn install
```

### 3️⃣ Configurar Supabase

#### Crear Proyecto en Supabase
1. Ir a [app.supabase.com](https://app.supabase.com)
2. Crear nuevo proyecto
3. Anotar la URL y las API Keys

#### Configurar Base de Datos
Ejecutar el siguiente SQL en el **SQL Editor** de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  status SMALLINT DEFAULT 1 CHECK (status IN (0, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de compras
CREATE TABLE purchased (
  purchase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  purchase_date TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_purchased_user_id ON purchased(user_id);
CREATE INDEX idx_purchased_product_id ON purchased(product_id);
CREATE INDEX idx_purchased_date ON purchased(purchase_date DESC);

-- Función para procesar compras (transacción atómica)
CREATE OR REPLACE FUNCTION process_purchase(
  p_user_id UUID,
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_product RECORD;
  v_total_price DECIMAL(10, 2);
  v_purchase_id UUID;
  v_remaining_stock INTEGER;
BEGIN
  -- Obtener información del producto con lock
  SELECT product_id, name, price, stock, status
  INTO v_product
  FROM products
  WHERE product_id = p_product_id
  FOR UPDATE;

  -- Validar que existe el producto
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto no encontrado';
  END IF;

  -- Validar que el producto está activo
  IF v_product.status = 0 THEN
    RAISE EXCEPTION 'Producto no disponible: El producto "%" está inactivo', v_product.name;
  END IF;

  -- Validar stock suficiente
  IF v_product.stock < p_quantity THEN
    RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', v_product.stock, p_quantity;
  END IF;

  -- Calcular precio total
  v_total_price := v_product.price * p_quantity;

  -- Reducir stock
  UPDATE products
  SET stock = stock - p_quantity,
      updated_at = NOW()
  WHERE product_id = p_product_id;

  -- Obtener stock restante
  SELECT stock INTO v_remaining_stock
  FROM products
  WHERE product_id = p_product_id;

  -- Insertar compra
  INSERT INTO purchased (user_id, product_id, quantity, total_price)
  VALUES (p_user_id, p_product_id, p_quantity, v_total_price)
  RETURNING purchase_id INTO v_purchase_id;

  -- Retornar resultado
  RETURN json_build_object(
    'purchase_id', v_purchase_id,
    'remaining_stock', v_remaining_stock
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-insertar usuario después de registro
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, username, lastname, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'lastname', 'Apellido'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Políticas RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON users FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para productos (públicos para lectura)
CREATE POLICY "Productos son visibles para todos"
  ON products FOR SELECT
  USING (status = 1);

-- Políticas para compras
CREATE POLICY "Usuarios pueden ver sus propias compras"
  ON purchased FOR SELECT
  USING (auth.uid() = user_id);
```

### 4️⃣ Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu-proyecto-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# URL del sitio (para callbacks de autenticación)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **Importante**: Nunca subas el archivo `.env.local` a Git. Ya está incluido en `.gitignore`.

### 5️⃣ Crear Carpetas de Uploads

```bash
mkdir -p public/uploads/avatar
mkdir -p public/uploads/products
```

### 6️⃣ Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### 7️⃣ Crear Usuario Administrador

Después de iniciar el proyecto, registrar un usuario y luego ejecutar en Supabase SQL Editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

---

## 📁 Estructura del Proyecto

```
turing-next-test-app/
├── public/
│   └── uploads/              # Archivos subidos
│       ├── avatar/           # Imágenes de perfil
│       └── products/         # Imágenes de productos
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── api/              # API Routes (Backend)
│   │   │   ├── auth/         # Autenticación
│   │   │   │   ├── login/    # POST - Inicio de sesión
│   │   │   │   ├── signup/   # POST - Registro
│   │   │   │   ├── logout/   # POST - Cierre de sesión
│   │   │   │   └── callback/ # GET - Callback de email
│   │   │   ├── products/     # CRUD de productos
│   │   │   │   ├── route.ts  # GET/POST productos
│   │   │   │   └── [id]/     # GET/PUT/PATCH por ID
│   │   │   ├── users/        # CRUD de usuarios (admin)
│   │   │   ├── purchased/    # GET/POST compras
│   │   │   ├── stats/        # GET estadísticas públicas
│   │   │   └── upload/       # POST subida de imágenes
│   │   ├── admin/            # Dashboard administrativo
│   │   ├── login/            # Página de login
│   │   ├── signup/           # Página de registro
│   │   ├── auth/             # Páginas de confirmación
│   │   ├── layout.tsx        # Layout raíz
│   │   ├── page.tsx          # Página principal
│   │   └── globals.css       # Estilos globales
│   ├── components/           # Componentes React
│   │   ├── admin/            # Componentes del panel admin
│   │   ├── ui/               # Componentes de UI (Radix)
│   │   ├── Header.tsx        # Barra de navegación
│   │   ├── Footer.tsx        # Pie de página
│   │   ├── ProductsGrid.tsx  # Cuadrícula de productos
│   │   ├── PurchaseModal.tsx # Modal de compra
│   │   └── ProfileModal.tsx  # Modal de perfil
│   ├── hooks/                # Hooks personalizados
│   │   ├── useAuth.ts        # Autenticación
│   │   ├── useProducts.ts    # Gestión de productos
│   │   ├── usePurchase.ts    # Flujo de compra
│   │   └── useProfile.ts     # Actualización de perfil
│   ├── lib/                  # Utilidades y configuración
│   │   ├── supabase-browser.ts    # Cliente Supabase (cliente)
│   │   ├── supabase-server.ts     # Cliente Supabase (servidor)
│   │   ├── supabase-middleware.ts # Cliente para middleware
│   │   └── utils.ts          # Utilidades generales
│   └── middleware.ts         # Middleware de Next.js
├── .env.local                # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏗️ Arquitectura del Proyecto

### Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN            │
│  (Components, Pages, UI Elements)       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO       │
│  (Custom Hooks, State Management)       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         CAPA DE API (Backend)           │
│  (Next.js API Routes)                   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         CAPA DE DATOS                   │
│  (Supabase PostgreSQL)                  │
└─────────────────────────────────────────┘
```

---

## 📊 Diagrama de Base de Datos

```mermaid
erDiagram
    auth_users ||--o| users : "referencia"
    users ||--o{ purchased : "tiene muchos"
    products ||--o{ purchased : "referenciado de"

    auth_users {
        uuid id PK
        varchar email UK
        timestamptz email_confirmed_at
        jsonb raw_user_meta_data
    }

    users {
        uuid user_id PK
        varchar username
        varchar lastname
        varchar email UK
        varchar role
    }

    products {
        uuid product_id PK
        varchar name
        text description
        decimal price
        integer stock
        varchar category
        text image_url
        smallint status
    }

    purchased {
        uuid purchase_id PK
        uuid user_id FK
        uuid product_id FK
        integer quantity
        decimal total_price
    }
```

---

## 🔄 Flujos Principales

### Flujo de Autenticación

```mermaid
sequenceDiagram
    Usuario->>Frontend: Registro
    Frontend->>API: POST /api/auth/signup
    API->>Supabase: signUp()
    Supabase->>Usuario: Email confirmación
    Usuario->>Supabase: Confirma email
    Supabase->>DB: Trigger inserta en users
```

### Flujo de Compra

```mermaid
sequenceDiagram
    Usuario->>Frontend: Selecciona producto
    Frontend->>API: POST /api/purchased
    API->>DB: process_purchase()
    DB->>DB: Verifica stock
    DB->>DB: Reduce stock
    DB->>DB: Inserta compra
    DB->>API: Compra exitosa
    API->>Frontend: Confirmación
```

---

## 📡 Documentación de API

### 🔐 Autenticación

Todos los endpoints de autenticación retornan cookies seguras con el token de sesión.

---

#### POST `/api/auth/signup`

Registra un nuevo usuario en el sistema. Envía un email de confirmación.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura123",
  "username": "Juan",
  "lastname": "Pérez"
}
```

**Response (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente. Revisa tu email para confirmar.",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com"
  }
}
```

**Errores:**
- `400 Bad Request` - Datos faltantes o inválidos
- `409 Conflict` - Email ya registrado
- `500 Internal Server Error` - Error del servidor

---

#### POST `/api/auth/login`

Inicia sesión con credenciales de usuario.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura123"
}
```

**Response (200 OK):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
```

**Errores:**
- `400 Bad Request` - Email o password faltante
- `401 Unauthorized` - Credenciales inválidas
- `403 Forbidden` - Email no confirmado
- `500 Internal Server Error` - Error del servidor

---

#### POST `/api/auth/logout`

Cierra la sesión del usuario actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

**Errores:**
- `500 Internal Server Error` - Error al cerrar sesión

---

#### GET `/api/auth/callback`

Endpoint de callback para confirmación de email. Supabase redirige aquí después de la confirmación.

**Query Parameters:**
- `code` - Código de confirmación de Supabase
- `next` - URL de redirección (opcional)

**Response:**
- Redirección 302 a `/` o a la URL especificada en `next`

---

### 🛍️ Productos

#### GET `/api/products`

Lista todos los productos activos con filtros opcionales.

**Acceso:** Público (sin autenticación)

**Query Parameters:**
- `category` (opcional) - Filtra por categoría (ej: "Electrónica", "Ropa")
- `minPrice` (opcional) - Precio mínimo
- `maxPrice` (opcional) - Precio máximo

**Ejemplos:**
```
GET /api/products
GET /api/products?category=Electrónica
GET /api/products?minPrice=100&maxPrice=500
GET /api/products?category=Ropa&maxPrice=200
```

**Response (200 OK):**
```json
{
  "products": [
    {
      "product_id": "uuid-del-producto",
      "name": "Laptop HP",
      "description": "Laptop de alto rendimiento",
      "price": 899.99,
      "stock": 15,
      "category": "Electrónica",
      "image_url": "/uploads/products/laptop-hp.jpg",
      "status": 1,
      "created_at": "2025-11-01T10:00:00Z",
      "updated_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

**Errores:**
- `500 Internal Server Error` - Error al obtener productos

---

#### POST `/api/products`

Crea un nuevo producto.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Laptop HP",
  "description": "Laptop de alto rendimiento con 16GB RAM",
  "price": 899.99,
  "stock": 15,
  "category": "Electrónica",
  "image_url": "/uploads/products/laptop-hp.jpg"
}
```

**Response (201 Created):**
```json
{
  "message": "Producto creado exitosamente",
  "product": {
    "product_id": "uuid-del-producto",
    "name": "Laptop HP",
    "description": "Laptop de alto rendimiento con 16GB RAM",
    "price": 899.99,
    "stock": 15,
    "category": "Electrónica",
    "image_url": "/uploads/products/laptop-hp.jpg",
    "status": 1
  }
}
```

**Errores:**
- `400 Bad Request` - Datos faltantes o inválidos
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `500 Internal Server Error` - Error al crear producto

---

#### GET `/api/products/[id]`

Obtiene información detallada de un producto específico.

**Acceso:** Público (sin autenticación)

**URL Parameters:**
- `id` - UUID del producto

**Ejemplo:**
```
GET /api/products/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Laptop HP",
  "description": "Laptop de alto rendimiento con 16GB RAM",
  "price": 899.99,
  "stock": 15,
  "category": "Electrónica",
  "image_url": "/uploads/products/laptop-hp.jpg",
  "status": 1,
  "created_at": "2025-11-01T10:00:00Z",
  "updated_at": "2025-11-01T10:00:00Z"
}
```

**Errores:**
- `404 Not Found` - Producto no encontrado
- `500 Internal Server Error` - Error al obtener producto

---

#### PUT `/api/products/[id]`

Actualiza completamente un producto existente.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` - UUID del producto

**Request Body:**
```json
{
  "name": "Laptop HP Actualizada",
  "description": "Nueva descripción",
  "price": 949.99,
  "stock": 20,
  "category": "Electrónica",
  "image_url": "/uploads/products/laptop-hp-v2.jpg",
  "status": 1
}
```

**Response (200 OK):**
```json
{
  "message": "Producto actualizado exitosamente",
  "product": {
    "product_id": "uuid-del-producto",
    "name": "Laptop HP Actualizada",
    "price": 949.99,
    "stock": 20
  }
}
```

**Errores:**
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `404 Not Found` - Producto no encontrado
- `500 Internal Server Error` - Error al actualizar

---

#### PATCH `/api/products/[id]`

Actualiza parcialmente un producto (solo campos enviados).

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (ejemplo - solo stock):**
```json
{
  "stock": 25
}
```

**Request Body (ejemplo - precio y status):**
```json
{
  "price": 799.99,
  "status": 0
}
```

**Response (200 OK):**
```json
{
  "message": "Producto actualizado exitosamente",
  "product": {
    "product_id": "uuid-del-producto",
    "stock": 25
  }
}
```

**Errores:**
- Mismos códigos que PUT

---

#### DELETE `/api/products/[id]`

Elimina un producto del sistema.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `404 Not Found` - Producto no encontrado
- `500 Internal Server Error` - Error al eliminar

---

### 🛒 Compras

#### GET `/api/purchased`

Obtiene el historial de compras del usuario autenticado por user_id

**Acceso:** Usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` - UUID del usuario

**Ejemplos:**
```
GET /api/purchased
GET /api/purchased?user_id=uuid-del-usuario
```

**Response (200 OK):**
```json
{
  "purchases": [
    {
      "purchase_id": "uuid-de-compra",
      "user_id": "uuid-del-usuario",
      "product_id": "uuid-del-producto",
      "quantity": 2,
      "total_price": 1799.98,
      "purchase_date": "2025-11-13T15:30:00Z",
      "product": {
        "name": "Laptop HP",
        "price": 899.99,
        "image_url": "/uploads/products/laptop-hp.jpg",
        "category": "Electrónica"
      }
    }
  ]
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - Usuario intenta ver compras de otro usuario sin ser admin
- `500 Internal Server Error` - Error al obtener compras

---

#### POST `/api/purchased`

Procesa una nueva compra. Valida stock, reduce inventario y registra la transacción.

**Acceso:** Usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": "uuid-del-producto",
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "message": "Compra realizada exitosamente",
  "purchase": {
    "purchase_id": "uuid-de-compra",
    "product_id": "uuid-del-producto",
    "quantity": 2,
    "total_price": 1799.98,
    "remaining_stock": 13
  }
}
```

**Errores:**
- `400 Bad Request` - product_id o quantity faltante
- `401 Unauthorized` - Token no proporcionado
- `404 Not Found` - Producto no encontrado
- `409 Conflict` - Stock insuficiente
- `410 Gone` - Producto inactivo
- `500 Internal Server Error` - Error al procesar compra

**Ejemplo de error de stock:**
```json
{
  "error": "Stock insuficiente. Disponible: 5, Solicitado: 10"
}
```

---

### 👥 Usuarios

#### GET `/api/users`

Lista todos los usuarios del sistema.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "user_id": "uuid-del-usuario",
      "username": "Juan",
      "lastname": "Pérez",
      "email": "juan@ejemplo.com",
      "role": "user",
      "created_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `500 Internal Server Error` - Error al obtener usuarios

---

#### GET `/api/users/[id]`

Obtiene información de un usuario específico.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user_id": "uuid-del-usuario",
  "username": "Juan",
  "lastname": "Pérez",
  "email": "juan@ejemplo.com",
  "role": "user",
  "created_at": "2025-11-01T10:00:00Z",
  "updated_at": "2025-11-01T10:00:00Z"
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `404 Not Found` - Usuario no encontrado
- `500 Internal Server Error` - Error al obtener usuario

---

#### PUT `/api/users/[id]`

Actualiza información de un usuario.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "Juan Carlos",
  "lastname": "Pérez García",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "message": "Usuario actualizado exitosamente",
  "user": {
    "user_id": "uuid-del-usuario",
    "username": "Juan Carlos",
    "lastname": "Pérez García",
    "role": "admin"
  }
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `404 Not Found` - Usuario no encontrado
- `500 Internal Server Error` - Error al actualizar

---

#### DELETE `/api/users/[id]`

Elimina un usuario del sistema.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Errores:**
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `404 Not Found` - Usuario no encontrado
- `500 Internal Server Error` - Error al eliminar

---

### 📊 Estadísticas

#### GET `/api/stats`

Obtiene estadísticas públicas del sistema.

**Acceso:** Público (sin autenticación)

**Response (200 OK):**
```json
{
  "topBuyers": [
    {
      "user_id": "uuid-del-usuario",
      "username": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "total_purchases": 15,
      "total_spent": "4599.85"
    }
  ],
  "totalProducts": 125,
  "totalPurchases": 342
}
```

**Errores:**
- `500 Internal Server Error` - Error al obtener estadísticas

---

### 📤 Subida de Archivos

#### POST `/api/upload/products`

Sube una imagen de producto.

**Acceso:** Solo administradores

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
file: [archivo de imagen]
```

**Formatos soportados:** JPG, JPEG, PNG, GIF, WEBP
**Tamaño máximo:** 5MB

**Response (200 OK):**
```json
{
  "message": "Imagen subida exitosamente",
  "imageUrl": "/uploads/products/1699888888888-laptop.jpg"
}
```

**Errores:**
- `400 Bad Request` - No se proporcionó archivo o formato inválido
- `401 Unauthorized` - Token no proporcionado
- `403 Forbidden` - No es administrador
- `413 Payload Too Large` - Archivo excede 5MB
- `500 Internal Server Error` - Error al guardar archivo

---

### 🔑 Autenticación de API

La mayoría de los endpoints requieren autenticación mediante JWT (JSON Web Token). El token se obtiene al iniciar sesión y debe incluirse en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Roles de Usuario:**
- `user` - Usuario estándar (puede comprar y ver su perfil)
- `admin` - Administrador (acceso completo a CRUD de productos y usuarios)

**Códigos de Estado HTTP:**
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos inválidos o faltantes
- `401 Unauthorized` - Token no proporcionado o inválido
- `403 Forbidden` - Sin permisos suficientes
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email duplicado, stock insuficiente)
- `410 Gone` - Recurso inactivo
- `413 Payload Too Large` - Archivo muy grande
- `500 Internal Server Error` - Error del servidor

---

## 🛠️ Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting
```

---

## 🔐 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio |

---

## ✅ Buenas Prácticas Implementadas

### Seguridad
- ✅ Row Level Security (RLS)
- ✅ Validación de tokens JWT
- ✅ Variables de entorno
- ✅ Sanitización de inputs

### Rendimiento
- ✅ Lazy loading
- ✅ SSR
- ✅ Índices en BD
- ✅ Transacciones atómicas

### Código
- ✅ TypeScript
- ✅ Hooks personalizados
- ✅ Documentación JSDoc
- ✅ Separación de concerns

---

## 👨‍💻 Autor

**Abraham Carrasco** - [GitHub](https://github.com/Shiuko05)

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella! ⭐**

Hecho con ❤️ usando Next.js y Supabase

</div>
