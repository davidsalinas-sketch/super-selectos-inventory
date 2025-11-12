# 🏢 Super Selectos - Sistema de Inventario Vue.js

## 📋 Descripción
Sistema de gestión de inventario completo para Super Selectos El Salvador, desarrollado con Vue 3, Vite y Pinia.

## 🚀 Características

### ✨ Funcionalidades Principales
- ✅ **Autenticación por roles** (Administrador, Gerente, Empleado)
- ✅ **Gestión completa de inventario** con 118 sucursales
- ✅ **Dashboard con KPIs** en tiempo real
- ✅ **Gestión de usuarios y distribuidores**
- ✅ **Mapa interactivo** con ubicaciones de sucursales
- ✅ **Filtrado avanzado** por categoría y sucursal
- ✅ **Exportación a PDF** (próximamente)
- ✅ **Sistema de notificaciones**

### 🎨 Tecnologías
- **Vue 3** - Framework progresivo
- **Vite** - Build tool ultrarrápido
- **Pinia** - Estado global
- **Vue Router** - Navegación
- **Leaflet** - Mapas interactivos
- **jsPDF** - Generación de PDFs

## 📦 Instalación

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
cd super-selectos-vue
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Compilar para producción**
```bash
npm run build
```

5. **Previsualizar build de producción**
```bash
npm run preview
```

## 🔐 Credenciales de Acceso

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `1234`
- **Permisos**: Acceso completo

### Gerente
- **Usuario**: `gerente1`
- **Contraseña**: `gerente123`
- **Permisos**: Gestión de inventario y reportes

### Empleado
- **Usuario**: `empleado1`
- **Contraseña**: `empleado123`
- **Permisos**: Solo lectura y actualización de stock

## 📁 Estructura del Proyecto

```
super-selectos-vue/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Recursos (CSS, imágenes)
│   │   └── styles/
│   │       ├── main.css
│   │       ├── inventory.css
│   │       └── table.css
│   ├── components/        # Componentes reutilizables
│   │   ├── HeaderComponent.vue
│   │   ├── NotificationContainer.vue
│   │   └── ProductModal.vue
│   ├── layouts/           # Layouts de página
│   │   └── DashboardLayout.vue
│   ├── router/            # Configuración de rutas
│   │   └── index.js
│   ├── stores/            # Pinia stores
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   └── notification.js
│   ├── views/             # Vistas principales
│   │   ├── LoginView.vue
│   │   ├── InventoryView.vue
│   │   ├── UsersView.vue
│   │   ├── DistributorsView.vue
│   │   └── MapView.vue
│   ├── App.vue            # Componente raíz
│   └── main.js            # Entrada principal
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Previsualizar build
npm run lint     # Ejecutar linter
```

### Configuración de Vite

El proyecto usa Vite con las siguientes configuraciones:
- Puerto de desarrollo: `3000`
- Auto-apertura del navegador
- Alias `@` apuntando a `./src`

## 🎯 Características Vue 3

### Composition API
Todo el código usa Composition API con `<script setup>`:
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

### Pinia Stores
Estado global reactivo y modular:
```javascript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  // ...
  return { currentUser, login, logout }
})
```

### Vue Router
Navegación con guards de autenticación:
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  }
})
```

## 📊 Módulos Principales

### 1. Autenticación (`auth.js`)
- Login/Logout
- Gestión de usuarios
- Permisos por rol
- Persistencia en localStorage

### 2. Inventario (`inventory.js`)
- CRUD de productos
- Gestión de distribuidores
- Cálculo de KPIs
- 118 sucursales

### 3. Notificaciones (`notification.js`)
- Sistema de notificaciones toast
- Auto-cierre configurable
- Tipos: success, error, warning, info

## 🚀 Próximas Funcionalidades

- [ ] Exportación avanzada a PDF
- [ ] Sistema de compartir reportes
- [ ] Gráficos y analytics
- [ ] Backend API con Spring Boot
- [ ] Autenticación JWT
- [ ] Sincronización en tiempo real
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro

## 🐛 Reporte de Bugs

Si encuentras algún bug, por favor abre un issue con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Screenshots (si aplica)

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Proyecto propietario de Super Selectos El Salvador.

## 📞 Contacto

**Desarrollador**: David  
**Cliente**: Super Selectos El Salvador  
**Versión**: 3.0.0  
**Fecha**: Noviembre 2025

---

**¡Gracias por usar el Sistema de Inventario Super Selectos!** 🎉
