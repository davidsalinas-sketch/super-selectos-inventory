# Super Selectos - Sistema de Inventario con Spring Boot

## 📋 Descripción del Proyecto

**Super Selectos** es un sistema completo de gestión de inventario desarrollado en **Java Spring Boot**. Este sistema proporciona funcionalidades avanzadas para la administración de productos, usuarios, distribuidores y sucursales, con una interfaz web moderna y segura.

### ✨ Características Principales

- 🔐 **Autenticación y Autorización**: Sistema de roles (ADMIN, MANAGER, EMPLOYEE) con Spring Security
- 📦 **Gestión de Productos**: CRUD completo con filtros avanzados y métricas
- 👥 **Administración de Usuarios**: Gestión de empleados con diferentes niveles de acceso  
- 🏢 **Control de Distribuidores**: Registro y seguimiento de proveedores
- 🏪 **Gestión de Sucursales**: Administración multi-sucursal
- 📊 **Reportes PDF**: Generación profesional de reportes con iText
- 🔍 **API REST**: Endpoints completos con documentación Swagger
- 📱 **Interfaz Responsiva**: Frontend moderno con Thymeleaf y Bootstrap

---

## 🛠 Requisitos del Sistema

### Software Necesario

1. **Java Development Kit (JDK) 17 o superior**
2. **Maven 3.6+ (opcional - incluye wrapper)**
3. **IDE recomendado: IntelliJ IDEA, Eclipse o VS Code**
4. **Navegador web moderno**

---

## ⚙️ Instalación de Java

### Windows

1. **Descargar Java JDK 17:**
   - Visitar: https://adoptium.net/temurin/releases/
   - Seleccionar: Java 17 (LTS) para Windows x64
   - Descargar el archivo `.msi`

2. **Instalar JDK:**
   - Ejecutar el instalador descargado
   - Seguir las instrucciones del asistente
   - Instalar en la ruta por defecto: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot`

3. **Configurar Variables de Entorno:**

   **Opción A - Interfaz Gráfica:**
   - Presionar `Win + R`, escribir `sysdm.cpl` y presionar Enter
   - Ir a "Opciones Avanzadas" → "Variables de entorno"
   - En "Variables del sistema", hacer clic en "Nueva"
   - Nombre: `JAVA_HOME`
   - Valor: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot` (ajustar versión)
   - Buscar la variable `PATH`, seleccionar y hacer clic en "Editar"
   - Agregar nueva entrada: `%JAVA_HOME%\bin`

   **Opción B - PowerShell (Administrador):**
   ```powershell
   # Configurar JAVA_HOME permanentemente
   [Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.9.101-hotspot", "Machine")
   
   # Agregar Java al PATH
   $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
   [Environment]::SetEnvironmentVariable("PATH", "$currentPath;%JAVA_HOME%\bin", "Machine")
   ```

4. **Verificar Instalación:**
   - Abrir nueva ventana de PowerShell
   - Ejecutar: `java -version`
   - Debe mostrar la versión de Java instalada

---

## 🚀 Instalación y Configuración del Proyecto

### 1. Clonar/Descargar el Proyecto

```bash
# Si tienes Git instalado
git clone <url-del-repositorio>
cd superselectos-springboot

# O descargar y extraer el ZIP del proyecto
```

### 2. Compilar el Proyecto

```powershell
# Usar el wrapper de Maven incluido (Windows)
.\mvnw.cmd clean compile

# En sistemas Unix/Linux/Mac
./mvnw clean compile
```

### 3. Ejecutar la Aplicación

```powershell
# Windows
.\mvnw.cmd spring-boot:run

# Unix/Linux/Mac
./mvnw spring-boot:run
```

### 4. Acceder a la Aplicación

- **URL Principal**: http://localhost:8080
- **Consola H2 (Desarrollo)**: http://localhost:8080/h2-console
- **API Documentation**: http://localhost:8080/swagger-ui/index.html

---

## 🔑 Usuarios Predeterminados

| Usuario | Contraseña | Rol | Permisos |
|---------|-----------|-----|----------|
| admin | admin123 | ADMIN | Todos los permisos |
| manager | manager123 | MANAGER | Gestión de productos y reportes |
| empleado | empleado123 | EMPLOYEE | Solo lectura y operaciones básicas |

---

## 🗄 Configuración de Base de Datos

### Desarrollo (H2 - Por Defecto)
```properties
# Configuración automática
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=

# Consola H2 habilitada
spring.h2.console.enabled=true
```

### Producción (MySQL)
```properties
# Cambiar en application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/superselectos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

---

## 📁 Estructura del Proyecto

```
superselectos-springboot/
├── src/
│   ├── main/
│   │   ├── java/com/superselectos/
│   │   │   ├── SuperSelectosInventoryApplication.java
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── WebController.java
│   │   │   │   └── ProductController.java
│   │   │   ├── entity/
│   │   │   │   ├── Product.java
│   │   │   │   ├── User.java
│   │   │   │   ├── Distributor.java
│   │   │   │   └── Branch.java
│   │   │   ├── repository/
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── DistributorRepository.java
│   │   │   │   └── BranchRepository.java
│   │   │   └── service/
│   │   │       ├── ProductService.java
│   │   │       ├── UserService.java
│   │   │       └── UserDetailsServiceImpl.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── data.sql
│   │       ├── static/
│   │       └── templates/
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

## 🔧 Comandos Útiles

### Maven Commands
```bash
# Compilar proyecto
.\mvnw.cmd clean compile

# Ejecutar tests
.\mvnw.cmd test

# Crear JAR ejecutable
.\mvnw.cmd clean package

# Ejecutar aplicación
.\mvnw.cmd spring-boot:run

# Limpiar proyecto
.\mvnw.cmd clean
```

### Ejecutar JAR
```bash
# Después de hacer package
java -jar target/superselectos-springboot-1.0.0.jar
```

---

## 📊 API REST Endpoints

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `GET /api/products/low-stock` - Productos con stock bajo
- `GET /api/products/stats` - Estadísticas de productos

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

---

## 🛡 Configuración de Seguridad

### Roles y Permisos

| Endpoint | ADMIN | MANAGER | EMPLOYEE |
|----------|--------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Productos (Ver) | ✅ | ✅ | ✅ |
| Productos (Crear/Editar) | ✅ | ✅ | ❌ |
| Productos (Eliminar) | ✅ | ❌ | ❌ |
| Usuarios | ✅ | ❌ | ❌ |
| Reportes | ✅ | ✅ | ✅ |
| Configuración | ✅ | ❌ | ❌ |

---

## 🐛 Solución de Problemas

### Error: JAVA_HOME not found
```bash
# Verificar instalación
java -version
echo $JAVA_HOME    # Linux/Mac
echo %JAVA_HOME%   # Windows

# Configurar temporalmente (Windows)
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.9.101-hotspot
```

### Error: Puerto 8080 en uso
```properties
# Cambiar puerto en application.properties
server.port=8081
```

### Error de conexión a BD
```properties
# Verificar configuración en application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.show-sql=true
```

---

## 📝 Próximas Mejoras

- [ ] ✅ **Frontend completo con Thymeleaf**
- [ ] 📱 **Aplicación móvil con React Native** 
- [ ] 📊 **Dashboard con métricas avanzadas**
- [ ] 🔄 **Sistema de backup automático**
- [ ] 📧 **Notificaciones por email**
- [ ] 🌍 **Internacionalización (i18n)**
- [ ] 🔍 **Búsqueda avanzada con Elasticsearch**
- [ ] 📈 **Reportes con gráficos dinámicos**

---

## 📞 Soporte

Para reportar problemas o sugerir mejoras:

1. **Issues**: Crear un issue en el repositorio
2. **Email**: soporte@superselectos.com
3. **Documentación**: Wiki del proyecto

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

**© 2024 Super Selectos - Sistema de Inventario con Spring Boot**