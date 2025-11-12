# 📘 Documentación Completa - Sistema de Inventario Super Selectos El Salvador

**Versión:** 3.0.0  
**Fecha:** Noviembre 11, 2025  
**Autor:** David Salinas  
**Empresa:** Super Selectos El Salvador  

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Introducción](#introducción)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Guía de Uso](#guía-de-uso)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Decisiones Técnicas](#decisiones-técnicas)
9. [Seguridad](#seguridad)
10. [Mantenimiento y Soporte](#mantenimiento-y-soporte)
11. [Anexos](#anexos)

---

## 1. Resumen Ejecutivo

### 1.1 Descripción del Proyecto

El Sistema de Inventario Super Selectos es una solución integral desarrollada para gestionar el inventario de 118 sucursales distribuidas a lo largo de El Salvador. El sistema está diseñado con tecnologías modernas y escalables que garantizan alto rendimiento, seguridad y facilidad de uso.

### 1.2 Objetivos del Sistema

- **Centralización:** Gestión unificada del inventario de todas las sucursales
- **Visibilidad:** Monitoreo en tiempo real del stock y movimientos
- **Eficiencia:** Automatización de procesos de inventario y reportes
- **Accesibilidad:** Interfaz web moderna accesible desde cualquier dispositivo
- **Seguridad:** Control de acceso basado en roles (RBAC)
- **Trazabilidad:** Registro completo de movimientos y cambios

### 1.3 Alcance

El sistema cubre:
- Gestión de productos (CRUD completo)
- Control de inventario multi-sucursal
- Gestión de distribuidores
- Administración de usuarios con 3 roles
- Generación de reportes en PDF y Excel
- Visualización geográfica de sucursales
- KPIs y estadísticas en tiempo real

---

## 2. Introducción

### 2.1 Contexto del Negocio

Super Selectos es una cadena de supermercados líder en El Salvador con presencia en los 14 departamentos del país. La gestión eficiente del inventario es crítica para:

- Mantener niveles óptimos de stock
- Prevenir pérdidas por vencimiento de productos
- Optimizar la distribución entre sucursales
- Mejorar la toma de decisiones basada en datos

### 2.2 Problemática Anterior

Antes de implementar este sistema, se presentaban los siguientes desafíos:

- **Falta de centralización:** Cada sucursal manejaba inventario de forma independiente
- **Información fragmentada:** Dificultad para obtener una visión global
- **Procesos manuales:** Alto consumo de tiempo en tareas repetitivas
- **Errores humanos:** Inconsistencias en los registros
- **Retrasos en reportes:** Información desactualizada para toma de decisiones

### 2.3 Solución Implementada

Sistema web moderno que integra:

1. **Frontend Vue.js 3:** Interfaz de usuario reactiva y responsive
2. **Backend Spring Boot:** API REST robusta y escalable
3. **Autenticación segura:** Sistema de login con roles diferenciados
4. **Reportes automatizados:** Generación de PDFs y exportación a Excel
5. **Visualización geográfica:** Mapas interactivos de sucursales

---

## 3. Arquitectura del Sistema

### 3.1 Arquitectura General

El sistema implementa una arquitectura de **3 capas separadas**:

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│                      (Vue.js 3 + Vite)                       │
│  - Interfaz de Usuario                                       │
│  - Componentes Reactivos                                     │
│  - State Management (Pinia)                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE NEGOCIO                           │
│                 (Spring Boot 3.3.5)                          │
│  - Controladores REST                                        │
│  - Lógica de Negocio (Services)                             │
│  - Seguridad (Spring Security)                              │
│  - Validaciones                                              │
└────────────────────┬────────────────────────────────────────┘
                     │ JPA/Hibernate
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE PERSISTENCIA                        │
│                  (MySQL / H2 Database)                       │
│  - Entidades JPA                                             │
│  - Repositorios                                              │
│  - Gestión de Transacciones                                 │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Arquitectura Frontend (Vue.js 3)

```
super-selectos-vue/
│
├── src/
│   ├── main.js                    # Punto de entrada
│   ├── App.vue                    # Componente raíz
│   │
│   ├── router/                    # Enrutamiento
│   │   └── index.js              # Definición de rutas + guards
│   │
│   ├── stores/                    # State Management (Pinia)
│   │   ├── auth.js               # Autenticación y sesión
│   │   ├── inventory.js          # Gestión de inventario
│   │   └── notification.js       # Notificaciones
│   │
│   ├── views/                     # Vistas principales
│   │   ├── LoginView.vue         # Página de login
│   │   ├── InventoryView.vue     # Gestión de inventario
│   │   ├── UsersView.vue         # Administración de usuarios
│   │   ├── DistributorsView.vue  # Gestión de distribuidores
│   │   └── MapView.vue           # Mapa de sucursales
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── HeaderComponent.vue   # Barra de navegación
│   │   ├── ProductModal.vue      # Modal para productos
│   │   └── NotificationContainer.vue
│   │
│   ├── layouts/
│   │   └── DashboardLayout.vue   # Layout del dashboard
│   │
│   └── assets/
│       └── styles/                # Estilos CSS modulares
│           ├── main.css
│           ├── inventory.css
│           └── table.css
```

**Patrones implementados:**
- **Composition API:** Uso de `<script setup>` para código más limpio
- **Reactive State:** Vue 3 reactivity system
- **Route Guards:** Protección de rutas basada en autenticación
- **Component Modularity:** Componentes reutilizables y desacoplados

### 3.3 Arquitectura Backend (Spring Boot)

```
superselectos-springboot/
│
├── src/main/java/com/superselectos/inventory/
│   │
│   ├── SuperSelectosInventoryApplication.java  # Clase principal
│   │
│   ├── config/                    # Configuraciones
│   │   ├── SecurityConfig.java   # Spring Security
│   │   └── CustomAuthenticationSuccessHandler.java
│   │
│   ├── controller/                # Controladores REST
│   │   ├── ProductController.java
│   │   └── WebController.java
│   │
│   ├── service/                   # Lógica de negocio
│   │   ├── ProductService.java
│   │   ├── UserService.java
│   │   └── UserDetailsServiceImpl.java
│   │
│   ├── repository/                # Acceso a datos
│   │   ├── ProductRepository.java
│   │   ├── UserRepository.java
│   │   ├── BranchRepository.java
│   │   └── DistributorRepository.java
│   │
│   └── entity/                    # Entidades JPA
│       ├── Product.java
│       ├── User.java
│       ├── Branch.java
│       └── Distributor.java
│
└── src/main/resources/
    ├── application.properties     # Configuración de la app
    ├── data.sql                   # Datos iniciales
    └── templates/                 # Plantillas Thymeleaf
```

**Patrones implementados:**
- **Layered Architecture:** Separación en capas (Controller-Service-Repository)
- **Dependency Injection:** Inyección de dependencias con Spring
- **Repository Pattern:** Abstracción del acceso a datos
- **DTO Pattern:** Transfer Objects para APIs
- **Builder Pattern:** Construcción de objetos complejos

### 3.4 Modelo de Datos

#### Diagrama Entidad-Relación

```
┌─────────────────┐         ┌──────────────────┐
│     USER        │         │    PRODUCT       │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ username        │         │ code             │
│ password        │         │ name             │
│ role            │         │ category         │
│ email           │         │ price            │
│ name            │         │ stock            │
│ active          │         │ expirationDate   │
└─────────────────┘         │ imageUrl         │
                            │ distributor_id(FK)│
                            │ profitMargin     │
                            │ branchStock      │
                            │ active           │
                            └──────────┬───────┘
                                       │
                                       │ N:1
                                       │
                            ┌──────────▼───────┐
                            │  DISTRIBUTOR     │
                            ├──────────────────┤
                            │ id (PK)          │
                            │ name             │
                            │ contactPerson    │
                            │ email            │
                            │ phone            │
                            │ address          │
                            │ active           │
                            └──────────────────┘

┌─────────────────┐
│     BRANCH      │
├─────────────────┤
│ id (PK)         │
│ code            │
│ name            │
│ department      │
│ address         │
│ phone           │
│ manager         │
│ latitude        │
│ longitude       │
│ active          │
└─────────────────┘
```

---

## 4. Tecnologías Utilizadas

### 4.1 Stack Tecnológico Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vue.js** | 3.3.8 | Framework JavaScript progresivo |
| **Vite** | 5.4.21 | Build tool ultra-rápido |
| **Pinia** | 2.1.7 | State management oficial de Vue |
| **Vue Router** | 4.2.5 | Sistema de enrutamiento SPA |
| **Leaflet** | 1.9.4 | Mapas interactivos |
| **jsPDF** | 2.5.1 | Generación de PDFs |
| **Chart.js** | - | Gráficos y visualizaciones |

**Justificación de elección:**

- **Vue.js 3:** Framework reactivo con excelente performance, curva de aprendizaje suave y ecosistema robusto
- **Vite:** HMR instantáneo, builds optimizados, mejor experiencia de desarrollo
- **Pinia:** State management moderno, TypeScript friendly, mejor que Vuex
- **Leaflet:** Mapas open-source ligeros, sin restricciones de API keys

### 4.2 Stack Tecnológico Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Spring Boot** | 3.3.5 | Framework Java empresarial |
| **Spring Security** | 6.x | Autenticación y autorización |
| **Spring Data JPA** | - | ORM y persistencia |
| **Hibernate** | - | Implementación JPA |
| **MySQL** | 8.x | Base de datos producción |
| **H2 Database** | - | Base de datos desarrollo |
| **Lombok** | - | Reducción de boilerplate code |
| **MapStruct** | 1.5.5 | Mapeo de DTOs |
| **iText7** | 8.0.2 | Generación de PDFs |
| **Apache POI** | 5.2.4 | Exportación a Excel |
| **Thymeleaf** | - | Motor de plantillas |

**Justificación de elección:**

- **Spring Boot 3.3.5:** Última versión con soporte extendido hasta 2026, performance mejorado
- **Spring Security 6:** Configuración basada en lambdas, más moderna y legible
- **MySQL:** Base de datos robusta, ampliamente adoptada, excelente para aplicaciones empresariales
- **Lombok:** Reduce código repetitivo (getters, setters, constructores)

### 4.3 Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **VS Code** | IDE principal para desarrollo frontend |
| **IntelliJ IDEA / NetBeans** | IDE para desarrollo Java |
| **Git** | Control de versiones |
| **GitHub** | Repositorio remoto y colaboración |
| **Maven** | Gestión de dependencias Java |
| **npm** | Gestión de paquetes JavaScript |
| **Postman** | Testing de APIs REST |

---

## 5. Instalación y Configuración

### 5.1 Requisitos Previos

#### Software Requerido:

1. **Node.js** ≥ 18.0.0
2. **Java JDK** ≥ 17
3. **Maven** ≥ 3.8.0
4. **MySQL** ≥ 8.0 (para producción)
5. **Git** ≥ 2.40.0

#### Verificar instalaciones:

```bash
# Verificar Node.js
node --version

# Verificar Java
java -version

# Verificar Maven
mvn -version

# Verificar Git
git --version
```

### 5.2 Instalación del Proyecto Frontend (Vue.js)

#### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/davidsalinas-sketch/super-selectos-inventory.git
cd super-selectos-inventory/super-selectos-vue
```

#### Paso 2: Instalar dependencias

```bash
npm install
```

Se instalarán 211 paquetes aproximadamente.

#### Paso 3: Configurar variables de entorno (opcional)

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_TITLE=Super Selectos Inventory
```

#### Paso 4: Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

#### Paso 5: Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en `dist/`

### 5.3 Instalación del Proyecto Backend (Spring Boot)

#### Paso 1: Navegar al directorio backend

```bash
cd superselectos-springboot
```

#### Paso 2: Configurar base de datos

Editar `src/main/resources/application.properties`:

**Para desarrollo (H2):**
```properties
spring.datasource.url=jdbc:h2:mem:superselectos
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

**Para producción (MySQL):**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/superselectos
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

#### Paso 3: Compilar el proyecto

```bash
mvn clean install
```

#### Paso 4: Ejecutar la aplicación

**Opción 1: Con Maven**
```bash
mvn spring-boot:run
```

**Opción 2: Con JAR**
```bash
java -jar target/inventory-system-2.5.1.jar
```

**Opción 3: Script PowerShell (Windows)**
```powershell
.\start.ps1
```

La API estará disponible en: `http://localhost:8080`

#### Paso 5: Verificar instalación

Acceder a:
- **API Documentation:** `http://localhost:8080/swagger-ui.html`
- **H2 Console:** `http://localhost:8080/h2-console`
- **Health Check:** `http://localhost:8080/actuator/health`

### 5.4 Configuración de Base de Datos MySQL

#### Crear base de datos:

```sql
CREATE DATABASE superselectos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'superselectos_user'@'localhost' IDENTIFIED BY 'password_seguro';

GRANT ALL PRIVILEGES ON superselectos.* TO 'superselectos_user'@'localhost';

FLUSH PRIVILEGES;
```

#### Ejecutar script de datos iniciales:

```bash
mysql -u superselectos_user -p superselectos < src/main/resources/data.sql
```

### 5.5 Configuración de Producción

#### Frontend - Nginx Configuration:

```nginx
server {
    listen 80;
    server_name superselectos.com;
    
    root /var/www/superselectos/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Backend - Application.properties (Producción):

```properties
# Server
server.port=8080
server.servlet.context-path=/

# Database
spring.datasource.url=jdbc:mysql://db-server:3306/superselectos?useSSL=true
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Security
spring.security.user.name=${ADMIN_USERNAME}
spring.security.user.password=${ADMIN_PASSWORD}

# Logging
logging.level.root=WARN
logging.level.com.superselectos=INFO
```

---

## 6. Guía de Uso

### 6.1 Acceso al Sistema

#### Usuarios por Defecto:

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| admin | 1234 | Administrador | Acceso total |
| gerente1 | gerente123 | Gerente | Lectura/Escritura (sin usuarios) |
| empleado1 | empleado123 | Empleado | Solo lectura |

### 6.2 Módulo de Inventario

#### Funcionalidades principales:

1. **Visualizar productos**
   - Lista completa con paginación
   - Filtros por categoría, sucursal, distribuidor
   - Búsqueda en tiempo real

2. **Agregar producto**
   - Click en botón "+ Nuevo Producto"
   - Completar formulario:
     * Código
     * Nombre
     * Categoría
     * Precio
     * Stock por sucursal
     * Distribuidor
     * Fecha de vencimiento
   - Guardar

3. **Editar producto**
   - Click en ícono de edición (lápiz)
   - Modificar campos necesarios
   - Guardar cambios

4. **Eliminar producto**
   - Click en ícono de eliminación (papelera)
   - Confirmar acción

5. **Exportar reportes**
   - Botón "Exportar PDF": Genera reporte completo
   - Botón "Compartir": Comparte vía Web Share API

#### Filtros disponibles:

- **Por categoría:** Lácteos, Carnes, Frutas, Verduras, etc.
- **Por sucursal:** Seleccionar de 118 sucursales
- **Por distribuidor:** Filtrar por proveedor
- **Por búsqueda:** Buscar por nombre o código

### 6.3 Módulo de Usuarios

**Acceso:** Solo Administradores

#### Gestión de usuarios:

1. **Crear usuario**
   - Ingresar nombre de usuario
   - Asignar rol (Administrador/Gerente/Empleado)
   - Ingresar nombre completo y email
   - Establecer contraseña
   - Guardar

2. **Editar usuario**
   - Modificar datos del perfil
   - Cambiar rol
   - Actualizar contraseña

3. **Desactivar usuario**
   - Cambiar estado a inactivo
   - El usuario no podrá iniciar sesión

### 6.4 Módulo de Distribuidores

**Acceso:** Administradores y Gerentes

#### Gestión de proveedores:

1. **Registrar distribuidor**
   - Nombre de la empresa
   - Persona de contacto
   - Email y teléfono
   - Dirección

2. **Actualizar información**
   - Editar datos de contacto
   - Actualizar productos suministrados

3. **Ver productos por distribuidor**
   - Lista de productos que suministra cada distribuidor

### 6.5 Módulo de Mapa

#### Visualización geográfica:

- **Mapa interactivo** de El Salvador
- **118 marcadores** con ubicación de sucursales
- **Filtro por departamento:**
  * San Salvador
  * La Libertad
  * Santa Ana
  * San Miguel
  * Y 10 departamentos más

- **Información al hacer click:**
  * Nombre de sucursal
  * Dirección
  * Teléfono
  * Gerente a cargo

### 6.6 Dashboard y KPIs

**Indicadores principales:**

1. **Total de productos:** Cantidad de SKUs en sistema
2. **Sucursales activas:** 118 ubicaciones
3. **Stock total:** Suma de unidades en todas las sucursales
4. **Valor del inventario:** Valor monetario total

**Gráficos:**
- Distribución por categoría
- Stock por sucursal
- Productos próximos a vencer
- Distribuidores principales

---

## 7. Estructura del Proyecto

### 7.1 Estructura de Carpetas Frontend

```
super-selectos-vue/
│
├── public/                    # Archivos estáticos
│   └── logo.svg
│
├── src/
│   ├── main.js               # Entry point
│   ├── App.vue               # Root component
│   │
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css      # Estilos globales
│   │       ├── inventory.css # Estilos de inventario
│   │       └── table.css     # Estilos de tablas
│   │
│   ├── components/
│   │   ├── HeaderComponent.vue       # 80 líneas
│   │   ├── NotificationContainer.vue # 95 líneas
│   │   └── ProductModal.vue          # 187 líneas
│   │
│   ├── layouts/
│   │   └── DashboardLayout.vue       # 45 líneas
│   │
│   ├── router/
│   │   └── index.js                  # 58 líneas
│   │
│   ├── stores/
│   │   ├── auth.js                   # 83 líneas
│   │   ├── inventory.js              # 160 líneas
│   │   └── notification.js           # 23 líneas
│   │
│   └── views/
│       ├── LoginView.vue             # 140 líneas
│       ├── InventoryView.vue         # 241 líneas
│       ├── UsersView.vue             # 198 líneas
│       ├── DistributorsView.vue      # 178 líneas
│       └── MapView.vue               # 156 líneas
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### 7.2 Estructura de Carpetas Backend

```
superselectos-springboot/
│
├── src/
│   ├── main/
│   │   ├── java/com/superselectos/inventory/
│   │   │   ├── SuperSelectosInventoryApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java           # 131 líneas
│   │   │   │   └── CustomAuthenticationSuccessHandler.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── ProductController.java        # 120 líneas
│   │   │   │   └── WebController.java            # 45 líneas
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── Product.java                  # 149 líneas
│   │   │   │   ├── User.java                     # 78 líneas
│   │   │   │   ├── Branch.java                   # 95 líneas
│   │   │   │   └── Distributor.java              # 82 líneas
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── BranchRepository.java
│   │   │   │   └── DistributorRepository.java
│   │   │   │
│   │   │   └── service/
│   │   │       ├── ProductService.java           # 156 líneas
│   │   │       ├── UserService.java              # 98 líneas
│   │   │       └── UserDetailsServiceImpl.java   # 52 líneas
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── data.sql                          # Datos iniciales
│   │       │
│   │       ├── static/
│   │       │   ├── css/
│   │       │   └── js/
│   │       │
│   │       └── templates/
│   │           ├── login.html
│   │           ├── dashboard.html
│   │           ├── products.html
│   │           └── fragments/
│   │               └── navbar.html
│   │
│   └── test/
│       └── java/com/superselectos/inventory/
│           └── (tests unitarios)
│
├── .mvn/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

### 7.3 Archivos de Configuración

#### package.json (Frontend)

```json
{
  "name": "super-selectos-vue",
  "version": "3.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.8",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "leaflet": "^1.9.4",
    "jspdf": "^2.5.1"
  }
}
```

#### pom.xml (Backend)

```xml
<project>
  <groupId>com.superselectos</groupId>
  <artifactId>inventory-system</artifactId>
  <version>2.5.1</version>
  
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.5</version>
  </parent>
  
  <properties>
    <java.version>17</java.version>
  </properties>
  
  <dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- ... más dependencias ... -->
  </dependencies>
</project>
```

---

## 8. Decisiones Técnicas

### 8.1 ¿Por qué Vue.js 3 en lugar de React o Angular?

**Decisión:** Vue.js 3 con Composition API

**Razones:**

1. **Curva de aprendizaje suave:** Sintaxis intuitiva, fácil de aprender
2. **Performance superior:** Virtual DOM optimizado, mejor que Vue 2
3. **Composition API:** Código más organizado y reutilizable
4. **Ecosistema maduro:** Pinia, Vue Router, Vite bien integrados
5. **Tamaño reducido:** Bundle más pequeño que Angular
6. **TypeScript opcional:** No fuerza TypeScript como Angular
7. **Documentación excelente:** Docs oficiales muy completas

**Alternativas consideradas:**
- React: Ecosistema fragmentado, curva de aprendizaje de hooks
- Angular: Demasiado pesado para este proyecto, curva de aprendizaje alta

### 8.2 ¿Por qué Vite en lugar de Webpack?

**Decisión:** Vite 5

**Razones:**

1. **HMR instantáneo:** Hot Module Replacement ultra-rápido
2. **Builds optimizados:** Rollup para producción
3. **Configuración mínima:** Zero-config out of the box
4. **ES Modules nativos:** Aprovecha ESM del navegador
5. **Mejor DX:** Developer Experience superior

**Alternativas consideradas:**
- Webpack: Configuración compleja, builds lentos
- Parcel: Menos maduro que Vite

### 8.3 ¿Por qué Pinia en lugar de Vuex?

**Decisión:** Pinia 2.1.7

**Razones:**

1. **State management oficial:** Recomendado por Vue core team
2. **API más simple:** Sin mutations, solo actions
3. **TypeScript nativo:** Mejor soporte que Vuex
4. **Modular por diseño:** Cada store es independiente
5. **Devtools integrado:** Excelente debugging

**Alternativas consideradas:**
- Vuex: Deprecated en favor de Pinia
- Context API: No escala bien

### 8.4 ¿Por qué Spring Boot 3.3.5?

**Decisión:** Spring Boot 3.3.5 con Java 17

**Razones:**

1. **Soporte LTS:** Soporte extendido hasta 2026
2. **Performance mejorado:** GraalVM native images
3. **Spring Security 6:** Configuración moderna con lambdas
4. **Observability:** Micrometer y actuator mejorados
5. **Java 17 LTS:** Virtual threads, pattern matching
6. **Ecosistema robusto:** Spring Data, Spring Security

**Alternativas consideradas:**
- Node.js + Express: Menos robusto para sistemas empresariales
- Django: Preferimos Java por el equipo actual
- .NET Core: Ecosistema menos maduro en Linux

### 8.5 ¿Por qué MySQL en lugar de PostgreSQL?

**Decisión:** MySQL 8.0

**Razones:**

1. **Simplicidad:** Más fácil de configurar y mantener
2. **Performance:** Excelente para queries de lectura (mayoría del sistema)
3. **Compatibilidad:** Amplio soporte en hosting providers
4. **Experiencia del equipo:** Equipo más familiarizado con MySQL
5. **JSON support:** Soporte nativo para columnas JSON

**Alternativas consideradas:**
- PostgreSQL: Features avanzados no necesarios en este proyecto
- MongoDB: No relacional, no adecuado para este modelo de datos

### 8.6 Decisiones de Seguridad

#### Autenticación y Autorización

**Implementación:**
- Spring Security 6 con autenticación basada en sesión
- Password encoding con BCrypt
- CSRF protection habilitado
- Role-based access control (RBAC)

**Justificación:**
- Sesiones más simples que JWT para aplicaciones web tradicionales
- BCrypt es estándar de industria para hashing de contraseñas
- RBAC cubre las necesidades del negocio (3 roles)

#### Protección de Endpoints

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
    .requestMatchers("/api/products/**").authenticated()
    .anyRequest().permitAll()
)
```

### 8.7 Decisiones de Performance

#### Frontend

1. **Code splitting:** Rutas lazy-loaded
2. **Asset optimization:** Imágenes optimizadas, minificación
3. **Caching:** Service workers para PWA (futuro)
4. **Virtual scrolling:** Para listas largas de productos

#### Backend

1. **Connection pooling:** HikariCP para MySQL
2. **Query optimization:** Índices en columnas frecuentes
3. **Lazy loading:** Relaciones JPA cargadas solo cuando se necesitan
4. **Caching:** Spring Cache para datos estáticos

### 8.8 Decisiones de Escalabilidad

**Arquitectura preparada para:**

1. **Horizontal scaling:** Stateless backend, sesiones en Redis (futuro)
2. **Load balancing:** Nginx como reverse proxy
3. **Database sharding:** Por región geográfica si es necesario
4. **CDN:** Archivos estáticos del frontend
5. **Microservicios:** Arquitectura permite migración gradual

---

## 9. Seguridad

### 9.1 Autenticación

#### Flujo de autenticación:

```
1. Usuario ingresa credenciales
   ↓
2. Frontend envía POST /api/login
   ↓
3. Spring Security valida contra database
   ↓
4. Si es válido, crea sesión y retorna cookie JSESSIONID
   ↓
5. Frontend almacena sesión en Pinia store
   ↓
6. Todas las peticiones incluyen cookie de sesión
```

#### Configuración de seguridad:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .formLogin(form -> form.loginPage("/login"))
        .logout(logout -> logout.logoutSuccessUrl("/"));
    return http.build();
}
```

### 9.2 Autorización

#### Roles y permisos:

| Rol | Permisos |
|-----|----------|
| **ADMIN** | - CRUD completo de productos<br>- Gestión de usuarios<br>- Gestión de distribuidores<br>- Visualización de reportes<br>- Acceso a configuración |
| **MANAGER** | - CRUD completo de productos<br>- Lectura de usuarios<br>- Gestión de distribuidores<br>- Visualización de reportes |
| **EMPLOYEE** | - Lectura de productos<br>- Visualización de reportes<br>- No puede modificar datos |

#### Implementación en código:

**Backend:**
```java
@PreAuthorize("hasRole('ADMIN')")
public List<User> getAllUsers() { ... }

@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public Product updateProduct(Product product) { ... }
```

**Frontend:**
```javascript
// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresRole) {
    const hasRole = to.meta.requiresRole.includes(authStore.user.rol)
    next(hasRole ? undefined : '/unauthorized')
  } else {
    next()
  }
})
```

### 9.3 Protección contra Vulnerabilidades

#### SQL Injection

**Prevención:** JPA con parámetros preparados

```java
// ✅ Seguro
@Query("SELECT p FROM Product p WHERE p.name = :name")
Product findByName(@Param("name") String name);

// ❌ Inseguro (no usado)
// String query = "SELECT * FROM products WHERE name = '" + name + "'";
```

#### XSS (Cross-Site Scripting)

**Prevención:** 
- Vue.js escapa automáticamente HTML
- CSP headers configurados
- Sanitización de inputs

```javascript
// Vue escapa automáticamente
<p>{{ userInput }}</p>  // Seguro

// Para HTML crudo, usar v-html con precaución
<div v-html="trustedHtml"></div>  // Solo para contenido confiable
```

#### CSRF (Cross-Site Request Forgery)

**Prevención:** CSRF tokens automáticos de Spring Security

```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
)
```

#### Password Security

**Implementación:**

1. **Hashing con BCrypt:**
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // Strength 12
}
```

2. **Políticas de contraseñas:**
   - Mínimo 8 caracteres
   - Al menos 1 mayúscula
   - Al menos 1 número
   - No permitir contraseñas comunes

3. **Almacenamiento:**
   - Solo hash almacenado en DB
   - Nunca se almacena en texto plano
   - Salt único por contraseña (BCrypt)

### 9.4 HTTPS y Comunicación Segura

**Configuración SSL/TLS:**

```properties
# application.properties (Producción)
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=${SSL_PASSWORD}
server.ssl.key-store-type=PKCS12
```

**Headers de seguridad:**

```java
http.headers(headers -> headers
    .contentSecurityPolicy("default-src 'self'")
    .frameOptions().deny()
    .xssProtection().block(true)
)
```

### 9.5 Auditoría y Logging

**Eventos auditados:**

- Inicios de sesión exitosos/fallidos
- Modificaciones de productos
- Creación/eliminación de usuarios
- Cambios en inventario
- Exportación de reportes

**Implementación:**

```java
@Aspect
@Component
public class AuditAspect {
    
    @AfterReturning("@annotation(Auditable)")
    public void logAction(JoinPoint joinPoint) {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        String action = joinPoint.getSignature().getName();
        
        auditLog.info("User {} performed action: {}", username, action);
    }
}
```

---

## 10. Mantenimiento y Soporte

### 10.1 Actualizaciones del Sistema

#### Calendario de actualizaciones:

| Tipo | Frecuencia | Descripción |
|------|------------|-------------|
| **Patches de seguridad** | Inmediato | Vulnerabilidades críticas |
| **Actualizaciones menores** | Mensual | Bug fixes, mejoras menores |
| **Actualizaciones mayores** | Trimestral | Nuevas funcionalidades |
| **Revisión de dependencias** | Mensual | Actualizar librerías |

#### Proceso de actualización:

1. **Desarrollo:**
   - Crear branch feature/fix
   - Implementar cambios
   - Pruebas locales

2. **Testing:**
   - Deploy en ambiente de staging
   - Pruebas de regresión
   - Validación de QA

3. **Producción:**
   - Backup de base de datos
   - Deploy en horario de bajo tráfico
   - Monitoreo post-deploy
   - Rollback si hay problemas

### 10.2 Backup y Recuperación

#### Estrategia de Backup:

**Base de datos:**
- **Backup completo:** Diario a las 2:00 AM
- **Backup incremental:** Cada 6 horas
- **Retención:** 30 días en hot storage, 1 año en cold storage

**Archivos:**
- **Imágenes de productos:** Backup semanal
- **Logs:** Rotación diaria, retención 90 días
- **Configuración:** Versionado en Git

**Script de backup automático:**

```bash
#!/bin/bash
# backup-mysql.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/superselectos"
DB_NAME="superselectos"

mysqldump -u backup_user -p$DB_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Retener solo últimos 30 días
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

#### Recuperación ante Desastres:

**RTO (Recovery Time Objective):** 4 horas  
**RPO (Recovery Point Objective):** 6 horas

**Procedimiento de recuperación:**

1. **Identificar incidente**
2. **Restaurar backup más reciente**
   ```bash
   gunzip < db_backup.sql.gz | mysql -u root -p superselectos
   ```
3. **Validar integridad de datos**
4. **Reiniciar servicios**
5. **Verificar funcionalidad**
6. **Comunicar a usuarios**

### 10.3 Monitoreo y Alertas

#### Métricas monitoreadas:

**Aplicación:**
- Tiempo de respuesta de API
- Tasa de errores HTTP
- Uso de memoria JVM
- Throughput de peticiones

**Base de datos:**
- Conexiones activas
- Slow queries
- Tamaño de base de datos
- Replicación (si aplica)

**Infraestructura:**
- CPU usage
- RAM usage
- Disk I/O
- Network bandwidth

#### Herramientas de monitoreo:

- **Spring Boot Actuator:** Health checks y métricas
- **Prometheus:** Recolección de métricas
- **Grafana:** Visualización de dashboards
- **ELK Stack:** Logging centralizado (opcional)

**Configuración de alertas:**

```yaml
# prometheus/alerts.yml
groups:
  - name: superselectos
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_total{status=~"5.."}[5m]) > 0.05
        annotations:
          summary: "Error rate > 5%"
          
      - alert: DatabaseDown
        expr: up{job="mysql"} == 0
        annotations:
          summary: "MySQL is down"
```

### 10.4 Troubleshooting Común

#### Problema: Frontend no se conecta al backend

**Síntomas:** Errores de CORS, conexión rechazada

**Solución:**
1. Verificar que backend esté corriendo: `curl http://localhost:8080/actuator/health`
2. Revisar configuración CORS en SecurityConfig.java
3. Verificar URL de API en .env.local del frontend

#### Problema: Error de autenticación

**Síntomas:** Login falla, 401 Unauthorized

**Solución:**
1. Verificar credenciales en base de datos
2. Revisar que password esté hasheado correctamente
3. Limpiar cookies del navegador
4. Verificar logs de Spring Security

#### Problema: Lentitud en carga de productos

**Síntomas:** Inventario tarda mucho en cargar

**Solución:**
1. Revisar slow queries en MySQL
2. Agregar índices a columnas frecuentes
3. Implementar paginación
4. Activar cache de Spring

#### Problema: Error al generar PDF

**Síntomas:** PDF no se descarga o está corrupto

**Solución:**
1. Verificar que jsPDF esté instalado
2. Revisar console del navegador
3. Probar con menos productos
4. Verificar fonts y recursos

### 10.5 Soporte Técnico

#### Niveles de soporte:

**Nivel 1 (Help Desk):**
- Reseteo de contraseñas
- Preguntas sobre uso
- Problemas de acceso

**Nivel 2 (Técnico):**
- Bugs de aplicación
- Problemas de performance
- Configuración de sistema

**Nivel 3 (Desarrollo):**
- Bugs críticos de código
- Nuevas funcionalidades
- Optimizaciones

#### Canales de soporte:

- **Email:** soporte@superselectos.com
- **Portal interno:** tickets.superselectos.com
- **Teléfono:** Emergencias 24/7
- **Documentación:** docs.superselectos.com

---

## 11. Anexos

### 11.1 Glosario de Términos

| Término | Definición |
|---------|------------|
| **API REST** | Interfaz de programación de aplicaciones que usa HTTP para comunicación |
| **CRUD** | Create, Read, Update, Delete - operaciones básicas de datos |
| **JPA** | Java Persistence API - estándar para ORM en Java |
| **ORM** | Object-Relational Mapping - mapeo objeto-relacional |
| **SPA** | Single Page Application - aplicación de una sola página |
| **JWT** | JSON Web Token - estándar para tokens de autenticación |
| **RBAC** | Role-Based Access Control - control de acceso basado en roles |
| **DTO** | Data Transfer Object - objeto para transferencia de datos |
| **HMR** | Hot Module Replacement - recarga en caliente de módulos |
| **SSR** | Server-Side Rendering - renderizado del lado del servidor |
| **PWA** | Progressive Web App - aplicación web progresiva |
| **CDN** | Content Delivery Network - red de distribución de contenido |

### 11.2 Variables de Entorno

#### Frontend (.env.local)

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# Application
VITE_APP_TITLE=Super Selectos Inventory
VITE_APP_VERSION=3.0.0

# Features
VITE_ENABLE_MAPS=true
VITE_ENABLE_PDF_EXPORT=true
VITE_ENABLE_NOTIFICATIONS=true

# Leaflet
VITE_MAP_CENTER_LAT=13.6929
VITE_MAP_CENTER_LNG=-89.2182
VITE_MAP_ZOOM=9
```

#### Backend (application.properties)

```properties
# Server
server.port=8080
server.servlet.context-path=/
server.servlet.session.timeout=30m

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/superselectos
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:password}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Security
spring.security.user.name=${ADMIN_USERNAME:admin}
spring.security.user.password=${ADMIN_PASSWORD:1234}

# Actuator
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized

# Logging
logging.level.root=INFO
logging.level.com.superselectos=DEBUG
logging.file.name=logs/superselectos.log
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 11.3 Comandos Útiles

#### Git

```bash
# Clonar repositorio
git clone https://github.com/davidsalinas-sketch/super-selectos-inventory.git

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Ver cambios
git status
git diff

# Commit
git add .
git commit -m "feat: descripción del cambio"

# Push
git push origin feature/nueva-funcionalidad

# Actualizar desde main
git pull origin main

# Ver historial
git log --oneline --graph
```

#### npm (Frontend)

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Limpiar cache
npm cache clean --force

# Actualizar paquetes
npm update

# Verificar vulnerabilidades
npm audit
npm audit fix
```

#### Maven (Backend)

```bash
# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Crear JAR
mvn clean package

# Ejecutar aplicación
mvn spring-boot:run

# Limpiar target
mvn clean

# Verificar dependencias
mvn dependency:tree

# Actualizar dependencias
mvn versions:display-dependency-updates
```

#### Docker (Futuro)

```bash
# Build imagen
docker build -t superselectos-backend .

# Ejecutar contenedor
docker run -p 8080:8080 superselectos-backend

# Ver contenedores
docker ps

# Logs
docker logs -f container_id

# Detener
docker stop container_id
```

### 11.4 Referencias y Recursos

#### Documentación Oficial

- **Vue.js:** https://vuejs.org/
- **Spring Boot:** https://spring.io/projects/spring-boot
- **Vite:** https://vitejs.dev/
- **Pinia:** https://pinia.vuejs.org/
- **Leaflet:** https://leafletjs.com/
- **MySQL:** https://dev.mysql.com/doc/

#### Tutoriales y Guías

- Vue.js 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Spring Security 6: https://docs.spring.io/spring-security/reference/
- RESTful API Design: https://restfulapi.net/
- Git Best Practices: https://git-scm.com/book/en/v2

#### Comunidad y Soporte

- Stack Overflow: https://stackoverflow.com/
- Vue.js Discord: https://discord.com/invite/vue
- Spring Community: https://spring.io/community
- GitHub Issues: https://github.com/davidsalinas-sketch/super-selectos-inventory/issues

### 11.5 Changelog

#### Versión 3.0.0 (Noviembre 2025)

**Nuevas funcionalidades:**
- ✨ Sistema Vue.js 3 completo con Composition API
- ✨ Pinia para state management
- ✨ Vue Router con guards de autenticación
- ✨ Mapas interactivos con Leaflet (118 sucursales)
- ✨ Exportación de reportes en PDF
- ✨ Diseño responsive y moderno

**Mejoras:**
- ⚡ Performance mejorado con Vite
- ⚡ Hot Module Replacement instantáneo
- 🔒 Seguridad mejorada con Spring Security 6
- 📱 Interfaz optimizada para móviles

**Cambios técnicos:**
- 🔧 Actualizado a Spring Boot 3.3.5
- 🔧 Migración de Vuex a Pinia
- 🔧 Configuración de seguridad basada en lambdas
- 🔧 Eliminación de métodos deprecated

#### Versión 2.5.1 (Backend Original)

**Funcionalidades:**
- Sistema Spring Boot básico
- CRUD de productos
- Gestión de usuarios
- Thymeleaf templates
- Autenticación básica

### 11.6 Licencia y Derechos

**Propietario:** Super Selectos El Salvador  
**Desarrollador:** David Salinas  
**Licencia:** Propietaria - Uso interno exclusivo  

**Restricciones:**
- ❌ No redistribuir sin autorización
- ❌ No uso comercial externo
- ✅ Modificaciones internas permitidas
- ✅ Despliegue en infraestructura de Super Selectos

### 11.7 Contacto

**Equipo de Desarrollo:**
- **Email:** desarrollo@superselectos.com
- **Repositorio:** https://github.com/davidsalinas-sketch/super-selectos-inventory

**Soporte Técnico:**
- **Email:** soporte@superselectos.com
- **Teléfono:** +503 XXXX-XXXX
- **Horario:** Lunes a Viernes, 8:00 AM - 5:00 PM

---

## 📌 Resumen de Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de código (Frontend)** | ~2,400 |
| **Líneas de código (Backend)** | ~3,800 |
| **Total de archivos** | 62 |
| **Componentes Vue** | 10 |
| **Endpoints REST** | 15+ |
| **Entidades JPA** | 4 |
| **Tiempo de desarrollo** | 2 meses |
| **Cobertura de tests** | 75% (objetivo) |
| **Sucursales soportadas** | 118 |
| **Usuarios concurrentes** | 50+ |

---

**Documento generado el:** 11 de Noviembre, 2025  
**Versión del documento:** 1.0  
**Próxima revisión:** Febrero 2026

---

*Este documento es confidencial y propiedad de Super Selectos El Salvador. Queda prohibida su distribución sin autorización expresa.*
