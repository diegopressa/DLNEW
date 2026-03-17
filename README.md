# DL Diseño & Estampado - Web Enterprise

Este es un proyecto greenfield desarrollado para **DL Diseño & Estampado**, enfocado en la conversión de clientes corporativos que buscan uniformes para sus equipos.

## Stack Tecnológico
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (Premium Design System)
- **Prisma** + **PostgreSQL**
- **Lucide React** (Iconografía)

## Estructura del Proyecto
- `src/app/(public)`: Páginas visibles para los clientes (Inicio, Productos, Trabajos, Contacto).
- `src/app/admin`: Panel de control para el dueño del negocio.
- `src/components/landing`: Secciones modulares de la página principal.
- `src/components/layout`: Componentes globales (Navbar, Footer, Sidebar).
- `prisma/schema.prisma`: Modelo de datos para gestionar todo el contenido desde el panel.

## Configuración Inicial

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Base de Datos:**
   Crea un archivo `.env` en la raíz (si no existe) y agrega tu URL de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/dl_db?schema=public"
   ```

3. **Sincronizar base de datos y sembrar datos iniciales:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## Panel de Administración
Puedes acceder a `/admin/login` para gestionar el contenido.
- **Usuario:** `admin`
- **Contraseña:** `admin123`
*(Nota: Esto es una configuración inicial simplificada para demostración).*

## Características de Conversión
- Botón flotante de WhatsApp siempre visible.
- CTAs directos a presupuestos en cada sección.
- Enfoque visual corporativo y profesional (B2B).
- Galería de trabajos reales para generar confianza.

## Recomendación de Despliegue
Se recomienda desplegar en **Vercel** para una integración nativa con Next.js y un rendimiento óptimo. La base de datos puede hospedarse en **Vercel Postgres**, **Supabase** o **Railway**.
