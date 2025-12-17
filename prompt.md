
# App Prompt: Auto Parts Hub (GranRepuestos)

## 1. Visión General

Crear una aplicación web de E-commerce moderna, responsive y de alto rendimiento llamada "Auto Parts Hub". La aplicación servirá como un catálogo en línea para repuestos de automóviles, permitiendo a los usuarios buscar, filtrar y ver productos detalladamente. El objetivo principal es generar solicitudes de cotización a través de WhatsApp o correo electrónico, ya que no se procesarán pagos directamente. La aplicación también debe incluir un panel de administración seguro para la gestión de productos y marcas.

**Tech Stack:**
*   **Framework:** Next.js con App Router
*   **Lenguaje:** TypeScript
*   **UI:** React, ShadCN UI, Tailwind CSS
*   **Iconos:** Lucide React
*   **Base de Datos:** Firestore
*   **Autenticación:** Firebase Authentication (Email/Password para administradores)

---

## 2. Características Principales (User-Facing)

### 2.1. Página de Inicio (`/`)
*   **Hero Section:** Una sección de bienvenida a pantalla completa con una imagen de fondo de alta calidad (un auto o motor), un título principal ("GranRepuestos"), un eslogan, y un botón de llamada a la acción "Ver Catálogo" que redirige a `/parts`.
*   **Sección de Marcas:** Un carrusel de logotipos en bucle infinito que muestra las marcas de repuestos con las que se trabaja. Debe ser visualmente atractivo y moverse suavemente.
*   **Sección de Productos Destacados:** Un carrusel horizontal que muestra una selección de productos destacados. Cada tarjeta de producto debe mostrar:
    *   Imagen principal.
    *   Nombre del repuesto.
    *   Marca del repuesto.
    *   Año de compatibilidad.
    *   Precio.
    *   Botón para añadir al carrito.
*   **Sección de Confianza (MercadoLibre):** Una sección informativa que muestre el logo de MercadoLibre y un texto que indique la sólida reputación y años de experiencia en la plataforma para generar confianza en el cliente. No debe tener enlaces ni botones.
*   **Sección de Contacto:** Una sección clara que muestre los diferentes métodos de contacto: WhatsApp, correo electrónico, Instagram y ubicación física, cada uno con su respectivo icono.

### 2.2. Página de Catálogo de Repuestos (`/parts`)
*   **Layout:** Un diseño de grid responsive que muestre los productos.
*   **Tarjeta de Producto:** Cada producto en el grid debe ser una tarjeta interactiva que al hacer clic abra un modal con los detalles. La tarjeta debe contener:
    *   Imagen.
    *   Nombre del producto.
    *   Marca del vehículo compatible y año.
    *   Precio.
    *   Botón para añadir al carrito.
*   **Filtros Avanzados (Desktop):** Una barra lateral fija con las siguientes opciones de filtrado:
    *   Búsqueda por texto (nombre, SKU).
    *   Selector de Marca del Repuesto.
    *   Selector de Categoría (Motor, Frenos, etc.).
    *   Selector de Marca del Vehículo (Toyota, Ford, etc.).
    *   Selector de Modelo del Vehículo (dependiente de la marca seleccionada).
*   **Filtros (Móvil):** En dispositivos móviles, los filtros deben estar dentro de una `Sheet` (panel deslizable) que se activa con un botón "Filtrar".
*   **Paginación:** Sistema de paginación en la parte inferior para navegar entre las páginas de resultados.
*   **Modal de Detalles del Producto:** Al hacer clic en una tarjeta de producto, se debe abrir un `Dialog` (modal) con información detallada, evitando una recarga de página. El modal debe incluir:
    *   Carrusel de imágenes del producto.
    *   Nombre, SKU.
    *   Precio y disponibilidad de stock.
    *   Botones para añadir al carrito.
    *   Tabla con especificaciones técnicas: Marca del repuesto, categoría, compatibilidad (marca, modelo, año).
    *   Descripción del producto.

### 2.3. Carrito de Compras
*   **Acceso:** Un botón flotante de carrito de compras, siempre visible, que muestre el número de ítems añadidos.
*   **Funcionalidad:** Al hacer clic, se abre una `Sheet` (panel deslizable) desde el lateral.
*   **Contenido del Carrito:**
    *   Lista de productos añadidos, cada uno con su imagen, nombre, precio y cantidad.
    *   Controles para aumentar, disminuir o eliminar la cantidad de cada ítem.
    *   Cálculo del subtotal.
*   **Llamada a la Acción (CTA):** En lugar de un checkout, el carrito debe guiar al usuario a solicitar una cotización. Debe incluir dos botones prominentes:
    *   "Solicitar por WhatsApp": Abre WhatsApp con un mensaje pre-llenado que lista los productos del carrito.
    *   "Solicitar por Correo": Abre el cliente de correo del usuario con un borrador pre-llenado.

### 2.4. Páginas Estáticas
*   **Quiénes Somos (`/quienes-somos`):** Una página que narre la historia y misión de la empresa.
*   **Envíos (`/envios`):** Información sobre las políticas y métodos de envío.
*   **Políticas de Compra (`/politicas`):** Detalles sobre las políticas de devolución y garantía.

---

## 3. Panel de Administración (`/admin`)

### 3.1. Acceso y Seguridad
*   **Login:** Una página de inicio de sesión (`/login`) protegida para administradores. La autenticación se manejará con Firebase (Email y Contraseña).
*   **Rutas Protegidas:** El acceso a `/admin` debe estar restringido solo a usuarios autenticados como administradores. Los no autorizados deben ser redirigidos a la página de login.

### 3.2. Dashboard Principal
*   **Navegación por Pestañas:** Una interfaz basada en pestañas para gestionar "Repuestos" y "Marcas".
*   **Botón de Cerrar Sesión:** Un botón visible para que el administrador pueda cerrar su sesión.

### 3.3. Pestaña de Gestión de Repuestos
*   **Tabla de Repuestos:** Una tabla que lista todos los productos con las siguientes columnas: Imagen, Nombre, SKU, Precio, Stock, y un nuevo indicador de **Estado**.
*   **Funcionalidad de la Tabla:**
    *   **Búsqueda y Filtros:** Permitir buscar por nombre/SKU y filtrar por marca, categoría y estado de la publicación.
    *   **Paginación:** Para manejar grandes volúmenes de productos.
    *   **Acciones:** Botones para "Editar" y "Eliminar" cada producto.
*   **Indicador de Estado:**
    *   Una columna "Estado" con una insignia visual (badge).
    *   "Completo" (verde): Si el producto tiene nombre, SKU, precio > 0, marca, categoría y al menos una imagen.
    *   "Incompleto" (amarillo): Si falta alguno de los campos anteriores. Al pasar el mouse, un tooltip debe indicar qué campos faltan.
*   **Formulario de Crear/Editar Repuesto:**
    *   Se abrirá en un modal (`Dialog`).
    *   Campos: Nombre, SKU, Descripción, Precio, Stock, Marca (selector), Categoría (selector), Carga de múltiples imágenes (integración con Cloudinary), check para "Producto Destacado", y selectores multi-opción para compatibilidad de vehículos (Marca y Modelo).

### 3.4. Pestaña de Gestión de Marcas
*   **Tabla de Marcas:** Una tabla simple que muestre el logo y el nombre de la marca.
*   **Funcionalidad:** Búsqueda, paginación y acciones para "Editar" y "Eliminar".
*   **Formulario de Crear/Editar Marca:** Un modal con campos para Nombre, URL del logo, URL de imagen de cabecera, país de origen, sitio web y descripción.

---

## 4. Estilo y Pautas de UI/UX

*   **Paleta de Colores:** Utilizar el tema por defecto de ShadCN, pero personalizar las variables CSS en `globals.css` para que coincidan con la identidad de marca (azul oscuro como primario, azul eléctrico como acento, gris claro como fondo).
*   **Tipografía:** Usar la fuente 'Inter' para una apariencia limpia y moderna.
*   **Componentes:** Priorizar el uso de componentes de ShadCN UI para mantener la consistencia (Buttons, Cards, Dialogs, Sheets, etc.).
*   **Responsive Design:** La aplicación debe ser completamente funcional y estéticamente agradable en dispositivos móviles, tablets y de escritorio.
*   **Experiencia de Usuario:** Las interacciones deben ser fluidas, con transiciones sutiles. Los estados de carga deben ser gestionados con componentes `Skeleton` para evitar cambios bruscos en la interfaz (layout shifting).
*   **Accesibilidad:** Asegurarse de que los componentes interactivos (botones, diálogos) sean accesibles (e.g., que `Dialog` tenga un `DialogTitle`).
