// Super Selectos Inventory Management System - Enhanced Version
class InventorySystem {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.sucursales = [];
        this.users = [];
        this.distributors = [];
        this.editingProductId = null;
        this.editingUserId = null;
        this.editingDistributorId = null;
        
        this.initializeData();
        this.initializeEventListeners();
        this.loadData();
        this.generateSucursales();
        
        // Limpiar texto extraño que pueda aparecer en el DOM
        this.initializeTextCleaner();
    }

    // Limpiar texto extraño que puede aparecer en el PDF
    initializeTextCleaner() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.cleanStrangeText());
        } else {
            this.cleanStrangeText();
        }
        
        // También limpiar periódicamente
        setInterval(() => this.cleanStrangeText(), 2000);
    }

    cleanStrangeText() {
        // Selectores específicos para elementos que pueden tener texto extraño
        const selectors = [
            '.report-title', '.header-text', '.subtitle', '.small-caption', 
            '.summary-heading', 'h1', 'h2', 'h3', '.kpi-label', '.toolbar h1'
        ];
        
        document.querySelectorAll(selectors.join(',')).forEach(el => {
            if (!el || !el.textContent) return;
            
            const originalText = el.textContent;
            const cleanText = originalText
                .replace(/&+/g, ' ')           // Quitar múltiples &
                .replace(/[ØÜ]/g, '')          // Quitar caracteres extraños
                .replace(/={2,}/g, '')         // Quitar múltiples =
                .replace(/\s{2,}/g, ' ')       // Quitar espacios múltiples
                .trim();
                
            if (cleanText !== originalText && cleanText.length > 0) {
                el.textContent = cleanText;
                console.log('Texto limpiado:', originalText, '->', cleanText);
            }
        });
        
        // Ocultar elementos con texto sospechoso (parche temporal)
        document.querySelectorAll('body *').forEach(el => {
            if (!el.textContent) return;
            const text = el.textContent.trim();
            
            // Si contiene muchos símbolos extraños, ocultarlo
            if (text.length > 5 && /[&ØÜ=]{3,}/.test(text)) {
                el.style.display = 'none';
                console.warn('Elemento oculto con texto sospechoso:', text.slice(0, 50));
            }
        });
    }

    // Initialize default data
    initializeData() {
        const defaultUsers = [
            { id: 1, usuario: "admin", password: "1234", rol: "Administrador", nombre: "Administrador Sistema", email: "admin@superselectos.com" },
            { id: 2, usuario: "gerente1", password: "gerente123", rol: "Gerente", nombre: "María González", email: "maria@superselectos.com" },
            { id: 3, usuario: "empleado1", password: "empleado123", rol: "Empleado", nombre: "Carlos Martínez", email: "carlos@superselectos.com" }
        ];

        const defaultDistributors = [
            { id: 1, nombre: "Distribuidora Central", contacto: "Juan Pérez", telefono: "+503 2234-5678", email: "contacto@distcentral.com" },
            { id: 2, nombre: "Alimentos del Valle", contacto: "Ana López", telefono: "+503 2345-6789", email: "ventas@alimentosvalle.com" },
            { id: 3, nombre: "Bebidas Premium", contacto: "Roberto Silva", telefono: "+503 2456-7890", email: "info@bebidaspremium.com" },
            { id: 4, nombre: "Carnes Selectas", contacto: "María Rodríguez", telefono: "+503 2567-8901", email: "pedidos@carnesselectas.com" },
            { id: 5, nombre: "Frutas Frescas SA", contacto: "Pedro Hernández", telefono: "+503 2678-9012", email: "ventas@frutasfrescas.com" }
        ];

        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('distributors')) {
            localStorage.setItem('distributors', JSON.stringify(defaultDistributors));
        }

        // Enhanced sample products with more variety - ALL WITH COMPLETE CATEGORY AND DISTRIBUTOR
        const sampleProducts = [
            // Alimentos
            {
                codigo: "ALI001", nombre: "Arroz Selecto Premium 1lb", categoria: "Alimentos", precio: 1.20,
                imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2025-12-31", ganancia: 25,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "ALI002", nombre: "Frijoles Rojos La Costeña", categoria: "Alimentos", precio: 0.89,
                imagen: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=200&h=200&fit=crop",
                distributor: "Alimentos del Valle", vencimiento: "2026-06-15", ganancia: 30,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "ALI003", nombre: "Aceite Vegetal Cristal 16oz", categoria: "Alimentos", precio: 2.15,
                imagen: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2025-08-20", ganancia: 20,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "ALI004", nombre: "Pasta Espagueti Don Pollo", categoria: "Alimentos", precio: 0.75,
                imagen: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=200&h=200&fit=crop",
                distributor: "Alimentos del Valle", vencimiento: "2026-03-10", ganancia: 35,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "ALI005", nombre: "Azúcar Blanca Central Izalco 2lb", categoria: "Alimentos", precio: 1.45,
                imagen: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2027-01-15", ganancia: 18,
                sucursales: this.generateRandomStock()
            },
            // Bebidas
            {
                codigo: "BEB001", nombre: "Coca Cola 355ml", categoria: "Bebidas", precio: 0.75,
                imagen: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop",
                distributor: "Bebidas Premium", vencimiento: "2025-09-30", ganancia: 40,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "BEB002", nombre: "Pepsi 600ml", categoria: "Bebidas", precio: 1.00,
                imagen: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop",
                distributor: "Bebidas Premium", vencimiento: "2025-10-15", ganancia: 38,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "BEB003", nombre: "Agua Cristal 500ml", categoria: "Bebidas", precio: 0.35,
                imagen: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
                distributor: "Bebidas Premium", vencimiento: "2026-12-31", ganancia: 50,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "BEB004", nombre: "Jugo Del Valle Naranja 1L", categoria: "Bebidas", precio: 1.85,
                imagen: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop",
                distributor: "Bebidas Premium", vencimiento: "2025-07-20", ganancia: 32,
                sucursales: this.generateRandomStock()
            },
            // Carnes
            {
                codigo: "CAR001", nombre: "Pollo Entero Fresco", categoria: "Carnes", precio: 4.50,
                imagen: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop",
                distributor: "Carnes Selectas", vencimiento: "2024-11-05", ganancia: 28,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "CAR002", nombre: "Carne Molida de Res 1lb", categoria: "Carnes", precio: 3.25,
                imagen: "https://images.unsplash.com/photo-1588347818131-d2d4b4187b1a?w=200&h=200&fit=crop",
                distributor: "Carnes Selectas", vencimiento: "2024-11-03", ganancia: 25,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "CAR003", nombre: "Jamón de Pavo Rebanado", categoria: "Carnes", precio: 2.80,
                imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop",
                distributor: "Carnes Selectas", vencimiento: "2024-11-10", ganancia: 35,
                sucursales: this.generateRandomStock()
            },
            // Frutas
            {
                codigo: "FRU001", nombre: "Manzanas Rojas 1lb", categoria: "Frutas", precio: 2.25,
                imagen: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
                distributor: "Frutas Frescas SA", vencimiento: "2024-11-15", ganancia: 45,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "FRU002", nombre: "Bananos Maduros 1lb", categoria: "Frutas", precio: 0.85,
                imagen: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop",
                distributor: "Frutas Frescas SA", vencimiento: "2024-11-08", ganancia: 55,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "FRU003", nombre: "Naranjas Dulces 1lb", categoria: "Frutas", precio: 1.50,
                imagen: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200&fit=crop",
                distributor: "Frutas Frescas SA", vencimiento: "2024-11-12", ganancia: 50,
                sucursales: this.generateRandomStock()
            },
            // Limpieza
            {
                codigo: "LIM001", nombre: "Detergente Ariel Polvo 1kg", categoria: "Limpieza", precio: 3.80,
                imagen: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2027-05-30", ganancia: 22,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "LIM002", nombre: "Jabón Dove Original", categoria: "Limpieza", precio: 1.25,
                imagen: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2026-08-15", ganancia: 40,
                sucursales: this.generateRandomStock()
            },
            // Juguetes
            {
                codigo: "JUG001", nombre: "Hot Wheels Carro Deportivo", categoria: "Juguetes", precio: 1.99,
                imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2030-12-31", ganancia: 60,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "JUG002", nombre: "Muñeca Barbie Clásica", categoria: "Juguetes", precio: 12.99,
                imagen: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2030-12-31", ganancia: 45,
                sucursales: this.generateRandomStock()
            },
            {
                codigo: "JUG003", nombre: "Transformers Optimus Prime", categoria: "Juguetes", precio: 25.50,
                imagen: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop",
                distributor: "Distribuidora Central", vencimiento: "2030-12-31", ganancia: 38,
                sucursales: this.generateRandomStock()
            }
        ];

        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify(sampleProducts));
        }
    }

    // Generate sucursales numeradas del 1 al 118
    generateSucursales() {
        if (this.sucursales.length === 0) {
            // Solo sucursales numeradas del 1 al 118
            for (let i = 1; i <= 118; i++) {
                this.sucursales.push(`Sucursal ${i}`);
            }
        }
        this.populateSucursalFilters();
    }

    // Generate random stock for sucursales (1 al 118)
    generateRandomStock() {
        const stock = {};
        for (let i = 1; i <= 118; i++) {
            stock[`Sucursal ${i}`] = Math.floor(Math.random() * 50) + 1;
        }
        return stock;
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Navigation buttons
        document.getElementById('inventoryBtn').addEventListener('click', () => {
            this.showSection('inventory');
        });

        document.getElementById('usersBtn').addEventListener('click', () => {
            this.showSection('users');
        });

        document.getElementById('distributorsBtn').addEventListener('click', () => {
            this.showSection('distributors');
        });

        // Add buttons
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openProductModal();
        });

        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.openUserModal();
        });

        document.getElementById('addDistributorBtn').addEventListener('click', () => {
            this.openDistributorModal();
        });

        // Export and share buttons
        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportToPDF();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.openShareModal();
        });

        // Forms
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserSubmit();
        });

        document.getElementById('distributorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDistributorSubmit();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.add('hidden');
            });
        });

        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.add('hidden');
            });
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterProducts();
        });

        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterProducts();
        });

        document.getElementById('sucursalFilter').addEventListener('change', () => {
            this.filterProducts();
        });

        // Map button (navegación)
        const mapBtn = document.getElementById('mapBtn');
        if (mapBtn) {
            mapBtn.addEventListener('click', () => {
                this.showSection('map');
            });
        }

        // Event listeners eliminados - ahora se usa Web Share API

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });
    }

    // Load data from localStorage
    loadData() {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            this.products = JSON.parse(storedProducts);
        }

        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        }

        const storedDistributors = localStorage.getItem('distributors');
        if (storedDistributors) {
            this.distributors = JSON.parse(storedDistributors);
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('products', JSON.stringify(this.products));
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('distributors', JSON.stringify(this.distributors));
    }

    // Handle login
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = this.users.find(u => u.usuario === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.showDashboard();
            this.updateUserInfo();
            this.showSection('inventory');
            this.showNotification('Bienvenido al sistema de inventario', 'success');
        } else {
            document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
        }
    }

    // Handle logout
    handleLogout() {
        this.currentUser = null;
        this.showLogin();
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').textContent = '';
    }

    // Show dashboard
    showDashboard() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.updateNavigation();
    }

    // Show login
    showLogin() {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
    }

    // Update navigation based on user role
    updateNavigation() {
        const userBtn = document.getElementById('usersBtn');
        const distributorBtn = document.getElementById('distributorsBtn');

        if (this.currentUser.rol === 'Administrador') {
            userBtn.style.display = 'block';
            distributorBtn.style.display = 'block';
        } else {
            userBtn.style.display = 'none';
            distributorBtn.style.display = 'none';
        }
    }

    // Show section
    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        
        // Show selected section
        document.getElementById(`${section}Section`).classList.remove('hidden');

        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${section}Btn`).classList.add('active');

        // Load section data
        switch(section) {
            case 'inventory':
                this.renderProducts();
                this.updateStockTotals();
                break;
            case 'users':
                this.renderUsers();
                break;
            case 'distributors':
                this.renderDistributors();
                break;
            case 'map':
                // Initialize the map lazily
                setTimeout(() => {
                    if (!this.map) {
                        this.initMap();
                    }
                    this.populateMapList();
                }, 150);
                break;
        }
    }

    // Update user info in header
    updateUserInfo() {
        document.getElementById('userInfo').textContent = 
            `${this.currentUser.nombre} (${this.currentUser.rol})`;
    }

    // Check permissions
    hasPermission(action) {
        const permissions = {
            'Administrador': ['create', 'read', 'update', 'delete', 'export', 'manage_users', 'manage_distributors'],
            'Gerente': ['create', 'read', 'update', 'delete', 'export'],
            'Empleado': ['read', 'update_stock']
        };

        return permissions[this.currentUser.rol]?.includes(action) || false;
    }

    // Populate sucursal filters and form (solo sucursales numeradas 1-118)
    populateSucursalFilters() {
        const sucursalFilter = document.getElementById('sucursalFilter');
        const sucursalesContainer = document.getElementById('sucursalesContainer');

        // Populate filter dropdown with individual branches (1 to 118)
        if (sucursalFilter) {
            sucursalFilter.innerHTML = '<option value="all">Todas las sucursales</option>';
            
            for (let i = 1; i <= 118; i++) {
                const option = document.createElement('option');
                option.value = i.toString();
                option.textContent = `Sucursal ${i}`;
                sucursalFilter.appendChild(option);
            }
        }

        // Populate form container (modal de productos)
        if (sucursalesContainer) {
            sucursalesContainer.innerHTML = '';
            for (let i = 1; i <= 118; i++) {
                const sucursal = `Sucursal ${i}`;
                const div = document.createElement('div');
                div.className = 'sucursal-item';
                div.innerHTML = `
                    <label>${sucursal}</label>
                    <input type="number" name="${sucursal}" min="0" value="0" class="sucursal-stock">
                `;
                sucursalesContainer.appendChild(div);
            }
        }
    }

    // Render products table
    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        const filteredProducts = this.getFilteredProducts();
        const sucursalFilter = document.getElementById('sucursalFilter').value;

        // Clear table content
        tbody.innerHTML = '';

        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();

        filteredProducts.forEach((product, index) => {
            let stockDisplay, sucursalesDisplay;
            
            if (sucursalFilter === 'all' || sucursalFilter === '') {
                // Show all branches data
                const totalStock = Object.values(product.sucursales || {}).reduce((sum, stock) => sum + stock, 0);
                const sucursalesWithStock = Object.entries(product.sucursales || {})
                    .filter(([_, stock]) => stock > 0)
                    .slice(0, 3)
                    .map(([sucursal, stock]) => `${sucursal}: ${stock}`)
                    .join(', ');
                stockDisplay = totalStock;
                sucursalesDisplay = sucursalesWithStock + (Object.keys(product.sucursales || {}).length > 3 ? '...' : '');
            } else {
                // Show specific branch data
                const branchKey = `Sucursal ${sucursalFilter}`;
                const branchStock = product.sucursales?.[branchKey] || 0;
                stockDisplay = branchStock;
                sucursalesDisplay = branchStock > 0 ? `${branchKey}: ${branchStock}` : 'Sin stock en esta sucursal';
            }

            // Check if product is near expiration (within 30 days)
            const expirationDate = new Date(product.vencimiento);
            const today = new Date();
            const daysToExpire = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
            const expirationClass = daysToExpire <= 30 ? 'near-expiration' : '';

            const row = document.createElement('tr');
            row.style.transform = 'none';
            row.style.transition = 'none';
            
            row.innerHTML = `
                <td>
                    <img src="${product.imagen || 'https://via.placeholder.com/50x50?text=Sin+Imagen'}" 
                         alt="${product.nombre}" class="product-image" 
                         onerror="this.src='https://via.placeholder.com/50x50?text=Sin+Imagen'">
                </td>
                <td>${product.codigo || ''}</td>
                <td>${product.nombre || ''}</td>
                <td>${product.categoria || ''}</td>
                <td>$${(product.precio || 0).toFixed(2)}</td>
                <td>${product.distributor || 'N/A'}</td>
                <td class="${expirationClass}">${product.vencimiento ? new Date(product.vencimiento).toLocaleDateString('es-ES') : 'N/A'}</td>
                <td>${product.ganancia || 0}%</td>
                <td>
                    <div class="stock-info">
                        <span class="stock-total">${stockDisplay}</span>
                        <span class="stock-sucursales">${sucursalesDisplay}</span>
                    </div>
                </td>
                <td class="sucursales-column">
                    ${sucursalFilter === 'all' || sucursalFilter === '' 
                        ? `<span class="total-sucursales">${Object.keys(product.sucursales || {}).filter(s => product.sucursales[s] > 0).length} sucursales</span>` 
                        : stockDisplay > 0 
                            ? `<span class="stock-available">Disponible: ${stockDisplay}</span>` 
                            : '<span class="stock-unavailable">Sin stock</span>'
                    }
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-action btn-edit" onclick="inventory.editProductById('${product.codigo}')">Editar</button>
                        <button class="btn-action btn-delete" onclick="inventory.deleteProduct('${product.codigo}')">Eliminar</button>
                    </div>
                </td>
            `;
            fragment.appendChild(row);
        });

        // Append all rows at once
        tbody.appendChild(fragment);
        
        // Update totals after rendering
        this.updateStockTotals();
    }

    // Helper method to edit product by ID (safer than passing JSON)
    editProductById(codigo) {
        const product = this.products.find(p => p.codigo === codigo);
        if (product) {
            this.openProductModal(product);
        }
    }

    // Render users table
    renderUsers() {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.usuario}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.rol.toLowerCase()}">${user.rol}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn-action btn-edit" onclick="inventory.openUserModal(${JSON.stringify(user).replace(/"/g, '&quot;')})">Editar</button>
                        ${user.id !== 1 ? `<button class="btn-action btn-delete" onclick="inventory.deleteUser(${user.id})">Eliminar</button>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Render distributors table
    renderDistributors() {
        const tbody = document.getElementById('distributorsTableBody');
        tbody.innerHTML = '';

        this.distributors.forEach(distributor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${distributor.id}</td>
                <td>${distributor.nombre}</td>
                <td>${distributor.contacto}</td>
                <td>${distributor.telefono}</td>
                <td>${distributor.email}</td>
                <td>
                    <div class="actions">
                        <button class="btn-action btn-edit" onclick="inventory.openDistributorModal(${JSON.stringify(distributor).replace(/"/g, '&quot;')})">Editar</button>
                        <button class="btn-action btn-delete" onclick="inventory.deleteDistributor(${distributor.id})">Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función removida - ya no se usan departamentos, solo sucursales numeradas

    // Sección de sucursales completamente eliminada por solicitud del usuario

    // Función eliminada - ya no se usan departamentos
    // Solo trabajamos con sucursales numeradas del 1 al 118

    // Función auxiliar para obtener todas las sucursales
    getAllBranches() {
        return this.getBranchLocations();
    }

    // Get filtered products
    getFilteredProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const sucursalFilter = document.getElementById('sucursalFilter').value;

        return this.products.filter(product => {
            const matchesSearch = !searchTerm || 
                product.nombre.toLowerCase().includes(searchTerm) ||
                product.codigo.toLowerCase().includes(searchTerm) ||
                product.categoria.toLowerCase().includes(searchTerm) ||
                (product.distributor && product.distributor.toLowerCase().includes(searchTerm));

            const matchesCategory = !categoryFilter || product.categoria === categoryFilter;

            const matchesSucursal = !sucursalFilter || sucursalFilter === 'all' || 
                (product.sucursales && product.sucursales[`Sucursal ${sucursalFilter}`] > 0);

            return matchesSearch && matchesCategory && matchesSucursal;
        });
    }

    // Filter products
    filterProducts() {
        this.renderProducts();
        this.updateStockTotals();
    }

    // Update stock totals when filters change
    updateStockTotals() {
        const filteredProducts = this.getFilteredProducts();
        const sucursalFilter = document.getElementById('sucursalFilter').value;
        
        let totalProductsWithStock, totalStock, totalValue, totalProfit;
        
        if (sucursalFilter === 'all' || sucursalFilter === '') {
            // Aggregate all branches
            totalProductsWithStock = filteredProducts.filter(p => {
                const totalStock = Object.values(p.sucursales || {}).reduce((s, st) => s + st, 0);
                return totalStock > 0;
            }).length;
            
            totalStock = filteredProducts.reduce((sum, product) => {
                return sum + Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0);
            }, 0);
            
            totalValue = filteredProducts.reduce((sum, product) => {
                const stock = Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0);
                return sum + (stock * product.precio);
            }, 0);

            totalProfit = filteredProducts.reduce((sum, product) => {
                const stock = Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0);
                const cost = product.precio / (1 + (product.ganancia / 100));
                const profit = (product.precio - cost) * stock;
                return sum + profit;
            }, 0);
        } else {
            // Calculate for specific branch
            const branchKey = `Sucursal ${sucursalFilter}`;
            
            totalProductsWithStock = filteredProducts.filter(p => 
                (p.sucursales?.[branchKey] || 0) > 0
            ).length;
            
            totalStock = filteredProducts.reduce((sum, product) => {
                return sum + (product.sucursales?.[branchKey] || 0);
            }, 0);
            
            totalValue = filteredProducts.reduce((sum, product) => {
                const stock = product.sucursales?.[branchKey] || 0;
                return sum + (stock * product.precio);
            }, 0);

            totalProfit = filteredProducts.reduce((sum, product) => {
                const stock = product.sucursales?.[branchKey] || 0;
                const cost = product.precio / (1 + (product.ganancia / 100));
                const profit = (product.precio - cost) * stock;
                return sum + profit;
            }, 0);
        }

        // Update KPI display with products that have stock
        this.updateKPIDisplay(totalProductsWithStock, totalStock, totalValue, totalProfit);
        
        // Show branch-specific details
        this.updateBranchDetails(sucursalFilter, filteredProducts);
    }

    // Update KPI cards display
    updateKPIDisplay(totalProducts, totalStock, totalValue, totalProfit) {
        document.getElementById('kpi-total-products').textContent = totalProducts;
        document.getElementById('kpi-stock-total').textContent = totalStock.toLocaleString();
        document.getElementById('kpi-valor-total').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('kpi-ganancia-est').textContent = `$${totalProfit.toFixed(2)}`;
    }

    // Update branch details panel
    updateBranchDetails(sucursalFilter, products) {
        let detailsDiv = document.getElementById('branchDetails');
        if (!detailsDiv) {
            detailsDiv = document.createElement('div');
            detailsDiv.id = 'branchDetails';
            detailsDiv.className = 'branch-details';
            const filtersDiv = document.querySelector('.filters');
            filtersDiv.parentNode.insertBefore(detailsDiv, filtersDiv.nextSibling);
        }

        if (sucursalFilter === 'all' || sucursalFilter === '') {
            // No mostrar panel cuando se seleccionan todas las sucursales
            detailsDiv.style.display = 'none';
        } else {
            detailsDiv.style.display = 'block';
            const branchKey = `Sucursal ${sucursalFilter}`;
            const branchProducts = products.filter(p => (p.sucursales?.[branchKey] || 0) > 0);
            const totalStock = branchProducts.reduce((sum, p) => sum + (p.sucursales[branchKey] || 0), 0);
            const totalValue = branchProducts.reduce((sum, p) => sum + ((p.sucursales[branchKey] || 0) * p.precio), 0);
            
            // Crear contenido del panel con botón "más"
            const showingCount = Math.min(branchProducts.length, 5);
            const remainingCount = Math.max(0, branchProducts.length - 5);
            
            detailsDiv.innerHTML = `
                <div class="branch-summary">
                    <div class="branch-header">
                        <h3>🏪 Sucursal ${sucursalFilter}</h3>
                        <div class="branch-status ${branchProducts.length > 0 ? 'active' : 'inactive'}">
                            ${branchProducts.length > 0 ? '✅ Operativa' : '⚠️ Sin stock'}
                        </div>
                    </div>
                    
                    <div class="branch-metrics">
                        <div class="metric-card">
                            <div class="metric-value">${branchProducts.length}</div>
                            <div class="metric-label">Productos disponibles</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${totalStock}</div>
                            <div class="metric-label">Unidades en stock</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">$${totalValue.toFixed(2)}</div>
                            <div class="metric-label">Valor del inventario</div>
                        </div>
                    </div>

                    ${branchProducts.length > 0 ? `
                        <div class="products-preview">
                            <h4>Productos en stock:</h4>
                            <div class="branch-stock-list" id="branchStockList">
                                ${branchProducts.slice(0, 5).map(p => `
                                    <div class="branch-stock-item">
                                        <span class="product-name">${p.nombre}</span>
                                        <span class="product-stock">${p.sucursales[branchKey]} unidades</span>
                                    </div>
                                `).join('')}
                            </div>
                            ${remainingCount > 0 ? `
                                <div class="more-products">
                                    <button class="btn-more" onclick="inventory.toggleAllProducts('${sucursalFilter}')">
                                        + ${remainingCount} más productos
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    ` : `
                        <div class="no-products">
                            <p>Esta sucursal no tiene productos en stock actualmente.</p>
                        </div>
                    `}
                </div>
            `;
        }
    }

    // Display totals in UI
    displayTotals(totalProducts, totalStock, totalValue, totalProfit) {
        // Crear o actualizar elemento de totales
        let totalsDiv = document.getElementById('stockTotals');
        if (!totalsDiv) {
            totalsDiv = document.createElement('div');
            totalsDiv.id = 'stockTotals';
            totalsDiv.className = 'stock-totals';
            document.querySelector('.table-container').parentNode.insertBefore(totalsDiv, document.querySelector('.table-container'));
        }
        
        totalsDiv.innerHTML = `
            <div class="totals-grid">
                <div class="total-item">
                    <span class="total-label">Productos:</span>
                    <span class="total-value">${totalProducts}</span>
                </div>
                <div class="total-item">
                    <span class="total-label">Stock Total:</span>
                    <span class="total-value">${totalStock}</span>
                </div>
                <div class="total-item">
                    <span class="total-label">Valor Total:</span>
                    <span class="total-value">$${totalValue.toFixed(2)}</span>
                </div>
                <div class="total-item">
                    <span class="total-label">Ganancia Total:</span>
                    <span class="total-value profit">$${totalProfit.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    // Export to PDF - Diseño elegante y profesional
    async exportToPDF() {
        if (!this.hasPermission('export')) {
            this.showNotification('No tienes permisos para exportar reportes', 'error');
            return;
        }

        const loadingNotification = this.showNotification('✨ Generando reporte PDF elegante y profesional...', 'info', false);

        try {
            if (typeof window.jspdf === 'undefined') {
                throw new Error('La librería jsPDF no está cargada correctamente');
            }

            const { jsPDF } = window.jspdf;
            if (!jsPDF) {
                throw new Error('jsPDF no está disponible');
            }

            const doc = new jsPDF('l', 'mm', 'a4'); // Landscape para mejor visualización de tabla
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 15; // Márgenes elegantes
            let yPosition = margin;

            // === 1. ENCABEZADO ELEGANTE Y PROFESIONAL ===
            const headerHeight = 35;
            
            // Fondo degradado elegante
            doc.setFillColor(46, 125, 50);
            doc.rect(0, 0, pageWidth, headerHeight, 'F');
            
            // Línea decorativa superior
            doc.setFillColor(76, 175, 80);
            doc.rect(0, 0, pageWidth, 3, 'F');
            
            // Logo de Super Selectos centrado y con calidad optimizada
            try {
                const logoImg = new Image();
                logoImg.crossOrigin = 'anonymous';
                
                await new Promise((resolve) => {
                    logoImg.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = 400; // Alta resolución
                            canvas.height = 80;
                            ctx.drawImage(logoImg, 0, 0, 400, 80);
                            const logoDataUrl = canvas.toDataURL('image/png', 1.0); // Máxima calidad
                            // Logo más grande y visible en la parte superior
                            doc.addImage(logoDataUrl, 'PNG', (pageWidth - 80) / 2, 1, 80, 16);
                        } catch (err) {
                            console.log('Error processing logo image');
                        }
                        resolve();
                    };
                    logoImg.onerror = () => {
                        console.log('Could not load logo image');
                        resolve();
                    };
                    logoImg.src = 'https://www.superselectos.com/img/super-selectos-banner.jpg';
                });
            } catch (error) {
                console.log('Error loading logo:', error);
            }
            
            // === 2. TÍTULOS ELEGANTES ===
            // Título principal con tipografía elegante (ajustado por logo más grande)
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('REPORTE DE INVENTARIO POR SUCURSAL', pageWidth/2, 22, { align: 'center' });
            
            // Subtítulo elegante
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Sistema Integral Super Selectos', pageWidth/2, 29, { align: 'center' });
            
            // Línea decorativa
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.line(pageWidth/2 - 60, 32, pageWidth/2 + 60, 32);

            yPosition = headerHeight + 10;

            // === INFORMACIÓN ELEGANTE DEL REPORTE ===
            const sucursalFilter = document.getElementById('sucursalFilter').value;
            const sucursalText = sucursalFilter === 'all' || sucursalFilter === '' 
                ? 'Todas las Sucursales' 
                : `Sucursal ${sucursalFilter}`;
                
            // Información en recuadro elegante
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(200, 200, 200);
            doc.rect(margin, yPosition, pageWidth - 2*margin, 20, 'FD');
            
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('INFORMACIÓN DEL REPORTE', margin + 10, yPosition + 8);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Sucursal: ${sucursalText}`, margin + 10, yPosition + 13);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, margin + 120, yPosition + 13);
            doc.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, margin + 200, yPosition + 13);
            doc.text(`Generado por: ${this.currentUser.nombre} (${this.currentUser.rol})`, margin + 10, yPosition + 17);

            yPosition += 28;

            // === 3. KPIs ELEGANTES ===
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(46, 125, 50);
            doc.text('MÉTRICAS EJECUTIVAS', margin, yPosition);
            
            // Línea decorativa bajo el título
            doc.setDrawColor(76, 175, 80);
            doc.setLineWidth(1);
            doc.line(margin, yPosition + 2, margin + 80, yPosition + 2);

            yPosition += 12;

            // === CALCULAR KPIs DINÁMICOS SEGÚN SUCURSAL ===
            let totalProducts, totalStockUnits, totalInventoryValue, totalProfit;
            
            if (sucursalFilter === 'all' || sucursalFilter === '') {
                // Totales globales
                totalProducts = this.products.filter(p => {
                    const totalStock = Object.values(p.sucursales || {}).reduce((s, st) => s + st, 0);
                    return totalStock > 0;
                }).length;
                
                totalStockUnits = this.products.reduce((sum, product) => {
                    return sum + Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0);
                }, 0);

                totalInventoryValue = this.products.reduce((sum, product) => {
                    const stock = Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0);
                    return sum + (stock * product.precio);
                }, 0);

                totalProfit = this.products.reduce((sum, product) => {
                    const stock = Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0);
                    const cost = product.precio / (1 + (product.ganancia / 100));
                    const profit = (product.precio - cost) * stock;
                    return sum + profit;
                }, 0);
            } else {
                // Totales por sucursal específica
                const branchKey = `Sucursal ${sucursalFilter}`;
                
                totalProducts = this.products.filter(p => (p.sucursales?.[branchKey] || 0) > 0).length;
                
                totalStockUnits = this.products.reduce((sum, product) => {
                    return sum + (product.sucursales?.[branchKey] || 0);
                }, 0);

                totalInventoryValue = this.products.reduce((sum, product) => {
                    const stock = product.sucursales?.[branchKey] || 0;
                    return sum + (stock * product.precio);
                }, 0);

                totalProfit = this.products.reduce((sum, product) => {
                    const stock = product.sucursales?.[branchKey] || 0;
                    const cost = product.precio / (1 + (product.ganancia / 100));
                    const profit = (product.precio - cost) * stock;
                    return sum + profit;
                }, 0);
            }

            // === TARJETAS KPIs ELEGANTES ===
            const cardWidth = (pageWidth - 2*margin - 30) / 4;
            const cardHeight = 28;
            let cardX = margin;
            const cardY = yPosition;

            // Función para formatear números con separadores de miles
            const formatNumber = (num) => {
                return new Intl.NumberFormat('es-ES').format(Math.round(num));
            };

            const formatCurrency = (num) => {
                if (num >= 1000000) {
                    return `$${(num / 1000000).toFixed(1)}M`;
                } else if (num >= 1000) {
                    return `$${(num / 1000).toFixed(0)}K`;
                } else {
                    return `$${num.toFixed(0)}`;
                }
            };

            // KPI 1: Total Productos - Diseño elegante
            doc.setFillColor(248, 250, 252);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
            doc.setDrawColor(76, 175, 80);
            doc.setLineWidth(2);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'D');
            
            // Ícono decorativo
            doc.setFillColor(46, 125, 50);
            doc.rect(cardX + 3, cardY + 3, cardWidth - 6, 4, 'F');
            
            doc.setTextColor(46, 125, 50);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text(formatNumber(totalProducts), cardX + cardWidth/2, cardY + 16, { align: 'center' });
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text('PRODUCTOS', cardX + cardWidth/2, cardY + 21, { align: 'center' });
            doc.text('DISPONIBLES', cardX + cardWidth/2, cardY + 25, { align: 'center' });

            // KPI 2: Stock Total
            cardX += cardWidth + 10;
            doc.setFillColor(248, 250, 252);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
            doc.setDrawColor(33, 150, 243);
            doc.setLineWidth(2);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'D');
            
            doc.setFillColor(33, 150, 243);
            doc.rect(cardX + 3, cardY + 3, cardWidth - 6, 4, 'F');
            
            doc.setTextColor(33, 150, 243);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(formatNumber(totalStockUnits), cardX + cardWidth/2, cardY + 16, { align: 'center' });
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text('UNIDADES', cardX + cardWidth/2, cardY + 21, { align: 'center' });
            doc.text('EN STOCK', cardX + cardWidth/2, cardY + 25, { align: 'center' });

            // KPI 3: Valor Total
            cardX += cardWidth + 10;
            doc.setFillColor(248, 250, 252);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
            doc.setDrawColor(255, 152, 0);
            doc.setLineWidth(2);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'D');
            
            doc.setFillColor(255, 152, 0);
            doc.rect(cardX + 3, cardY + 3, cardWidth - 6, 4, 'F');
            
            doc.setTextColor(255, 152, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(formatCurrency(totalInventoryValue), cardX + cardWidth/2, cardY + 16, { align: 'center' });
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text('VALOR TOTAL', cardX + cardWidth/2, cardY + 21, { align: 'center' });
            doc.text('INVENTARIO', cardX + cardWidth/2, cardY + 25, { align: 'center' });

            // KPI 4: Ganancia Estimada
            cardX += cardWidth + 10;
            doc.setFillColor(248, 250, 252);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'F');
            doc.setDrawColor(76, 175, 80);
            doc.setLineWidth(2);
            doc.rect(cardX, cardY, cardWidth, cardHeight, 'D');
            
            doc.setFillColor(76, 175, 80);
            doc.rect(cardX + 3, cardY + 3, cardWidth - 6, 4, 'F');
            
            doc.setTextColor(76, 175, 80);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(formatCurrency(totalProfit), cardX + cardWidth/2, cardY + 16, { align: 'center' });
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text('GANANCIA', cardX + cardWidth/2, cardY + 21, { align: 'center' });
            doc.text('ESTIMADA', cardX + cardWidth/2, cardY + 25, { align: 'center' });

            yPosition += 36; // Espacio elegante después de KPIs

            // === 4. DETALLE DE PRODUCTOS ELEGANTE ===
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(46, 125, 50);
            doc.text('DETALLE DE PRODUCTOS', margin, yPosition);
            
            // Línea decorativa
            doc.setDrawColor(76, 175, 80);
            doc.setLineWidth(1);
            doc.line(margin, yPosition + 2, margin + 100, yPosition + 2);
            
            yPosition += 10;

            // === TABLA ELEGANTE COMPLETA ===
            const tableWidth = pageWidth - 2*margin;
            
            // Anchos optimizados para todas las columnas (formato landscape)
            const colWidths = [
                tableWidth * 0.08, // Código: 8%
                tableWidth * 0.20, // Nombre: 20%
                tableWidth * 0.10, // Categoría: 10%
                tableWidth * 0.08, // Precio: 8%
                tableWidth * 0.16, // Distribuidor: 16%
                tableWidth * 0.10, // Vencimiento: 10%
                tableWidth * 0.08, // Ganancia: 8%
                tableWidth * 0.10, // Stock Total: 10%
                tableWidth * 0.10  // Sucursales: 10%
            ];

            // === CABECERA ELEGANTE ===
            doc.setFillColor(46, 125, 50);
            doc.rect(margin, yPosition, tableWidth, 10, 'F');
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.rect(margin, yPosition, tableWidth, 10, 'D');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            
            const headers = ['CÓDIGO', 'PRODUCTO', 'CATEGORÍA', 'PRECIO', 'DISTRIBUIDOR', 'VENCIMIENTO', 'GANANCIA', 'STOCK TOTAL', 'SUCURSALES'];
            const alignments = ['center', 'left', 'center', 'right', 'left', 'center', 'center', 'center', 'center'];
            
            let headerX = margin;
            headers.forEach((header, i) => {
                // Líneas divisorias entre columnas
                if (i > 0) {
                    doc.setDrawColor(255, 255, 255);
                    doc.line(headerX, yPosition, headerX, yPosition + 10);
                }
                
                let xPos;
                switch(alignments[i]) {
                    case 'center':
                        xPos = headerX + colWidths[i] / 2;
                        break;
                    case 'right':
                        xPos = headerX + colWidths[i] - 3;
                        break;
                    default: // left
                        xPos = headerX + 3;
                }
                
                doc.text(header, xPos, yPosition + 6.5, { align: alignments[i] });
                headerX += colWidths[i];
            });

            yPosition += 10;

            // === FILAS DE PRODUCTOS ELEGANTES ===
            const rowHeight = 12;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');

            // Función para crear cabecera repetible
            const createTableHeader = () => {
                doc.setFillColor(46, 125, 50);
                doc.rect(margin, yPosition, tableWidth, 10, 'F');
                doc.setDrawColor(255, 255, 255);
                doc.rect(margin, yPosition, tableWidth, 10, 'D');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                
                let headerX = margin;
                headers.forEach((header, i) => {
                    if (i > 0) {
                        doc.line(headerX, yPosition, headerX, yPosition + 10);
                    }
                    
                    let xPos;
                    switch(alignments[i]) {
                        case 'center':
                            xPos = headerX + colWidths[i] / 2;
                            break;
                        case 'right':
                            xPos = headerX + colWidths[i] - 3;
                            break;
                        default:
                            xPos = headerX + 3;
                    }
                    doc.text(header, xPos, yPosition + 6.5, { align: alignments[i] });
                    headerX += colWidths[i];
                });
                yPosition += 10;
            };

            // Función para texto con wrap inteligente
            const smartTruncate = (text, maxWidth, fontSize = 8) => {
                if (!text) return 'N/A';
                doc.setFontSize(fontSize);
                const charWidth = fontSize * 0.5; // Aproximación
                const maxChars = Math.floor(maxWidth / charWidth);
                
                if (text.length <= maxChars) return text;
                
                // Intentar cortar por palabras
                const words = text.split(' ');
                let result = '';
                for (const word of words) {
                    if ((result + ' ' + word).length <= maxChars - 3) {
                        result += (result ? ' ' : '') + word;
                    } else {
                        break;
                    }
                }
                return result + '...';
            };

            this.products.slice(0, 30).forEach((product, index) => {
                // Salto de página inteligente con cabecera repetida
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = margin + 10;
                    createTableHeader();
                    doc.setFontSize(8);
                    doc.setFont(undefined, 'normal');
                }

                // Filas alternadas elegantes
                if (index % 2 === 1) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, yPosition, tableWidth, rowHeight, 'F');
                }
                
                // Borde sutil
                doc.setDrawColor(230, 230, 230);
                doc.setLineWidth(0.2);
                doc.line(margin, yPosition + rowHeight, margin + tableWidth, yPosition + rowHeight);

                // Preparar datos completos según filtro de sucursal
                let stockData, sucursalesData;
                if (sucursalFilter === 'all' || sucursalFilter === '') {
                    stockData = Object.values(product.sucursales || {}).reduce((sum, stock) => sum + stock, 0);
                    const sucursalesConStock = Object.keys(product.sucursales || {}).filter(s => product.sucursales[s] > 0).length;
                    sucursalesData = `${sucursalesConStock} sucursales`;
                } else {
                    const branchKey = `Sucursal ${sucursalFilter}`;
                    stockData = product.sucursales?.[branchKey] || 0;
                    sucursalesData = stockData > 0 ? `Disp: ${stockData}` : 'Sin stock';
                }
                
                // Debug: Verificar que los datos están disponibles
                console.log(`Producto ${index}: categoria="${product.categoria}", distributor="${product.distributor}"`);
                
                const rowData = [
                    product.codigo || 'N/A',
                    smartTruncate(product.nombre || 'Sin nombre', colWidths[1] - 6),
                    smartTruncate(product.categoria || 'Sin categoría', colWidths[2] - 6),
                    `$${(product.precio || 0).toFixed(2)}`,
                    smartTruncate(product.distributor || 'Sin distribuidor', colWidths[4] - 6),
                    product.vencimiento ? new Date(product.vencimiento).toLocaleDateString('es-ES') : 'N/A',
                    `${product.ganancia || 0}%`,
                    formatNumber(stockData),
                    sucursalesData
                ];

                // Renderizar fila con estilo elegante
                doc.setTextColor(50, 50, 50);
                let cellX = margin;
                
                rowData.forEach((text, i) => {
                    // Divisores entre columnas
                    if (i > 0) {
                        doc.setDrawColor(220, 220, 220);
                        doc.setLineWidth(0.3);
                        doc.line(cellX, yPosition, cellX, yPosition + rowHeight);
                    }
                    
                    let xPos;
                    switch(alignments[i]) {
                        case 'center':
                            xPos = cellX + colWidths[i] / 2;
                            break;
                        case 'right':
                            xPos = cellX + colWidths[i] - 3;
                            break;
                        default: // left
                            xPos = cellX + 3;
                    }
                    
                    // Resaltar ciertos valores
                    if (i === 7 || i === 8) { // Stock Total y Sucursales
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(46, 125, 50);
                    } else if (i === 3) { // Precio
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(255, 152, 0);
                    } else {
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(50, 50, 50);
                    }
                    
                    doc.text(text, xPos, yPosition + 8, { align: alignments[i] });
                    cellX += colWidths[i];
                });

                yPosition += rowHeight;
            });

            yPosition += 15;

            // === 5. BLOQUE DE VALIDACIÓN PROFESIONAL ===
            // Verificar espacio disponible
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = margin + 10;
            }

            // Separador elegante
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 8;

            // === FIRMA DIGITAL ORGANIZADA Y CLARA ===
            const signatureBlockHeight = 25;
            
            // Fondo sutil para el bloque de firma
            doc.setFillColor(250, 252, 254);
            doc.rect(margin, yPosition, pageWidth - 2*margin, signatureBlockHeight, 'F');
            doc.setDrawColor(220, 230, 240);
            doc.rect(margin, yPosition, pageWidth - 2*margin, signatureBlockHeight);

            // Título del bloque
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(46, 125, 50);
            doc.text('VALIDACIÓN Y AUTORIZACIÓN', margin + 5, yPosition + 6);

            // Cargar imagen de firma con tamaño apropiado
            try {
                const firmaImg = new Image();
                firmaImg.crossOrigin = 'anonymous';
                
                await new Promise((resolve) => {
                    firmaImg.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = 360; // Más alta resolución
                            canvas.height = 144; // Proporción 2.5:1
                            
                            // Fondo blanco para la firma
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            
                            ctx.drawImage(firmaImg, 0, 0, canvas.width, canvas.height);
                            const firmaDataUrl = canvas.toDataURL('image/png', 1.0);
                            
                            // Firma con tamaño más visible y profesional
                            doc.addImage(firmaDataUrl, 'PNG', margin + 5, yPosition + 8, 50, 20);
                        } catch (err) {
                            console.log('Error processing signature image');
                        }
                        resolve();
                    };
                    firmaImg.onerror = () => {
                        console.log('Could not load signature image');
                        resolve();
                    };
                    firmaImg.src = 'https://www.consumer.es/app/uploads/2019/07/img_firma-3.jpg';
                });
            } catch (error) {
                console.log('Error loading signature:', error);
            }

            // Información de autorización organizada y clara (ajustada para firma más grande)
            const authX = margin + 60;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(70, 70, 70);
            
            doc.text('Firma Digital Autorizada', authX, yPosition + 10);
            doc.text('Sistema de Inventario Super Selectos', authX, yPosition + 14);
            
            // Información de generación en línea separada
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            const currentDate = new Date();
            doc.text(`Generado: ${currentDate.toLocaleDateString('es-ES')} - ${currentDate.toLocaleTimeString('es-ES')}`, authX, yPosition + 18);

            // === FOOTER PROFESIONAL CON PAGINACIÓN ===
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Página ${i} de ${pageCount}`, pageWidth - 25, pageHeight - 6);
                doc.text('© Super Selectos - Sistema Integral de Inventario', margin, pageHeight - 6);
            }

            // === PÁGINA POSTERIOR CON LOGO DE SUPER SELECTOS ===
            doc.addPage();
            
            // Fondo blanco limpio
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            
            // Logo grande centrado en la página posterior
            try {
                const backLogoImg = new Image();
                backLogoImg.crossOrigin = 'anonymous';
                
                await new Promise((resolve) => {
                    backLogoImg.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = 600; // Muy alta resolución
                            canvas.height = 150;
                            ctx.drawImage(backLogoImg, 0, 0, 600, 150);
                            const backLogoDataUrl = canvas.toDataURL('image/jpeg', 0.95);
                            
                            // Logo muy grande y centrado en la página posterior
                            const logoWidth = 120; // 120mm de ancho
                            const logoHeight = 30;  // 30mm de alto
                            const xPos = (pageWidth - logoWidth) / 2;
                            const yPos = (pageHeight - logoHeight) / 2;
                            
                            doc.addImage(backLogoDataUrl, 'JPEG', xPos, yPos, logoWidth, logoHeight);
                        } catch (err) {
                            console.log('Error processing back page logo');
                        }
                        resolve();
                    };
                    backLogoImg.onerror = () => {
                        console.log('Could not load back page logo');
                        resolve();
                    };
                    // URL específico del logo para la página posterior
                    backLogoImg.src = 'https://www.superselectos.com/img/super-selectos-banner.jpg';
                });
            } catch (error) {
                console.log('Error loading back page logo:', error);
            }

            // Guardar PDF
            const fileName = `inventario_super_selectos_${new Date().toISOString().split('T')[0]}_${Date.now()}.pdf`;
            
            this.lastGeneratedPDF = {
                doc: doc,
                fileName: fileName,
                blob: doc.output('blob')
            };

            doc.save(fileName);

            if (loadingNotification) {
                loadingNotification.remove();
            }

            this.showNotification('Reporte PDF mejorado generado correctamente', 'success');

        } catch (error) {
            if (loadingNotification) {
                loadingNotification.remove();
            }
            
            console.error('Error generating PDF:', error);
            this.showNotification('Error al generar el reporte PDF. Por favor, intenta de nuevo.', 'error');
        }
    }

    // Open share modal
    async openShareModal() {
        // Generar PDF si no existe
        if (!this.lastGeneratedPDF) {
            this.showNotification('Generando PDF para compartir...', 'info');
            try {
                await this.exportToPDF();
                if (!this.lastGeneratedPDF) {
                    this.showNotification('No se pudo generar el PDF para compartir', 'error');
                    return;
                }
            } catch (error) {
                this.showNotification('Error al generar PDF para compartir', 'error');
                return;
            }
        }

        // Intentar usar Web Share API primero (recomendado)
        await this.sharePdfWithWebShareAPI();
    }

    // Nueva función principal para compartir PDF usando Web Share API
    async sharePdfWithWebShareAPI() {
        try {
            // Crear archivo PDF como File object
            const pdfFile = new File([this.lastGeneratedPDF.blob], this.lastGeneratedPDF.fileName, {
                type: 'application/pdf'
            });

            // Verificar si el navegador soporta Web Share API con archivos
            if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                this.showNotification('📤 Abriendo selector de aplicaciones...', 'info');
                
                await navigator.share({
                    files: [pdfFile],
                    title: 'Reporte de Inventario - Super Selectos',
                    text: `📊 Reporte oficial de inventario generado el ${new Date().toLocaleDateString('es-ES')} por ${this.currentUser.nombre}. Total de productos: ${this.products.length}.`
                });
                
                this.showNotification('✅ PDF compartido exitosamente!', 'success');
                return;
            }
            
            // Fallback: mostrar opciones manuales
            this.showManualShareOptions(pdfFile);
            
        } catch (error) {
            if (error.name === 'AbortError') {
                this.showNotification('Compartir cancelado', 'info');
            } else {
                console.error('Error compartiendo:', error);
                this.showManualShareOptions();
            }
        }
    }

    // Opciones manuales cuando Web Share API no está disponible
    showManualShareOptions(pdfFile) {
        // Auto-descargar PDF
        const url = URL.createObjectURL(this.lastGeneratedPDF.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.lastGeneratedPDF.fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Mostrar modal con opciones
        const modalHTML = `
            <div id="shareOptionsModal" class="modal-overlay" onclick="this.remove()">
                <div class="modal-content share-options-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>📤 Compartir Reporte PDF</h2>
                        <button class="close-modal" onclick="document.getElementById('shareOptionsModal').remove()">&times;</button>
                    </div>
                    
                    <div class="share-options-content">
                        <div class="download-confirmation">
                            <div class="success-icon">✅</div>
                            <p><strong>PDF descargado exitosamente:</strong><br>
                            <code>${this.lastGeneratedPDF.fileName}</code></p>
                        </div>
                        
                        <div class="share-methods">
                            <h3>📲 Métodos de compartir:</h3>
                            
                            <div class="share-option" onclick="inventory.shareViaEmail('${this.lastGeneratedPDF.fileName}')">
                                <div class="option-icon">✉️</div>
                                <div class="option-content">
                                    <h4>Gmail / Email</h4>
                                    <p>Abrir Gmail y adjuntar PDF manualmente</p>
                                </div>
                                <div class="option-arrow">→</div>
                            </div>
                            
                            <div class="share-option" onclick="inventory.shareViaWhatsApp('${this.lastGeneratedPDF.fileName}')">
                                <div class="option-icon">💬</div>
                                <div class="option-content">
                                    <h4>WhatsApp</h4>
                                    <p>Abrir WhatsApp y adjuntar PDF manualmente</p>
                                </div>
                                <div class="option-arrow">→</div>
                            </div>
                            
                            <div class="share-option" onclick="inventory.copyShareMessage()">
                                <div class="option-icon">📋</div>
                                <div class="option-content">
                                    <h4>Copiar mensaje</h4>
                                    <p>Copiar texto descriptivo del reporte</p>
                                </div>
                                <div class="option-arrow">→</div>
                            </div>
                        </div>
                        
                        <div class="browser-info">
                            <p><strong>💡 Consejo:</strong> Para compartir directamente desde el navegador, usa Chrome en Android o Safari en iOS con la última versión.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Abrir Gmail con mensaje prellenado
    shareViaEmail(fileName) {
        const subject = 'Reporte de Inventario - Super Selectos';
        const body = `Estimado/a,

📊 REPORTE OFICIAL DE INVENTARIO - SUPER SELECTOS

Adjunto encontrarás el reporte completo de inventario.

📋 RESUMEN:
• Total de productos: ${this.products.length}
• Valor total: $${this.products.reduce((sum, p) => sum + (Object.values(p.sucursales || {}).reduce((s, st) => s + st, 0) * p.precio), 0).toFixed(2)}
• Fecha: ${new Date().toLocaleString('es-ES')}
• Generado por: ${this.currentUser.nombre}

📎 Archivo: ${fileName}

🏢 SUPER SELECTOS - Sistema de Inventario`;

        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl);
        
        this.showNotification('✉️ Gmail abierto. Adjunta manualmente el PDF descargado.', 'info');
        document.getElementById('shareOptionsModal')?.remove();
    }

    // Abrir WhatsApp con mensaje prellenado
    shareViaWhatsApp(fileName) {
        const message = `🏢 *SUPER SELECTOS*
📊 *REPORTE DE INVENTARIO*

📦 Productos: *${this.products.length}*
💰 Valor total: *$${this.products.reduce((sum, p) => sum + (Object.values(p.sucursales || {}).reduce((s, st) => s + st, 0) * p.precio), 0).toFixed(2)}*
📅 Fecha: *${new Date().toLocaleDateString('es-ES')}*
👤 Por: *${this.currentUser.nombre}*

📎 Archivo: ${fileName}

*Adjunta el PDF descargado a este mensaje*`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        this.showNotification('💬 WhatsApp abierto. Adjunta manualmente el PDF descargado.', 'info');
        document.getElementById('shareOptionsModal')?.remove();
    }

    // Copiar mensaje descriptivo
    copyShareMessage() {
        const message = `📊 REPORTE DE INVENTARIO - SUPER SELECTOS

📦 Total de productos: ${this.products.length}
💰 Valor total del inventario: $${this.products.reduce((sum, p) => sum + (Object.values(p.sucursales || {}).reduce((s, st) => s + st, 0) * p.precio), 0).toFixed(2)}
📅 Generado el: ${new Date().toLocaleString('es-ES')}
👤 Por: ${this.currentUser.nombre} (${this.currentUser.rol})

📎 Archivo PDF adjunto: ${this.lastGeneratedPDF?.fileName || 'reporte_inventario.pdf'}`;

        navigator.clipboard.writeText(message).then(() => {
            this.showNotification('📋 Mensaje copiado al portapapeles!', 'success');
            document.getElementById('shareOptionsModal')?.remove();
        }).catch(() => {
            this.showNotification('❌ Error al copiar mensaje', 'error');
        });
    }

    // Funciones de compartir simplificadas - Ver implementación arriba en openShareModal()

    // Product modal functions
    openProductModal(product = null) {
        if (!this.hasPermission('create') && !product) {
            this.showNotification('No tienes permisos para crear productos', 'error');
            return;
        }

        if (product && !this.hasPermission('update')) {
            this.showNotification('No tienes permisos para editar productos', 'error');
            return;
        }

        this.editingProductId = product ? product.codigo : null;
        document.getElementById('modalTitle').textContent = 
            product ? 'Editar Producto' : 'Agregar Producto';

        // Populate distributors dropdown
        const distributorSelect = document.getElementById('productDistributor');
        distributorSelect.innerHTML = '<option value="">Seleccionar distribuidor</option>';
        this.distributors.forEach(dist => {
            const option = document.createElement('option');
            option.value = dist.nombre;
            option.textContent = dist.nombre;
            distributorSelect.appendChild(option);
        });

        if (product) {
            document.getElementById('productCode').value = product.codigo;
            document.getElementById('productName').value = product.nombre;
            document.getElementById('productCategory').value = product.categoria;
            document.getElementById('productPrice').value = product.precio;
            document.getElementById('productImage').value = product.imagen || '';
            document.getElementById('productDistributor').value = product.distributor || '';
            document.getElementById('productExpiration').value = product.vencimiento || '';
            document.getElementById('productProfit').value = product.ganancia || 0;

            // Fill sucursal stocks
            Object.entries(product.sucursales || {}).forEach(([sucursal, stock]) => {
                const input = document.querySelector(`input[name="${sucursal}"]`);
                if (input) input.value = stock;
            });
        } else {
            document.getElementById('productForm').reset();
            document.querySelectorAll('.sucursal-stock').forEach(input => {
                input.value = 0;
            });
        }

        document.getElementById('productModal').classList.remove('hidden');
    }

    // Handle product form submission
    handleProductSubmit() {
        const sucursalStocks = {};
        let totalStock = 0;

        document.querySelectorAll('.sucursal-stock').forEach(input => {
            const stock = parseInt(input.value) || 0;
            sucursalStocks[input.name] = stock;
            totalStock += stock;
        });

        const product = {
            codigo: document.getElementById('productCode').value,
            nombre: document.getElementById('productName').value,
            categoria: document.getElementById('productCategory').value,
            precio: parseFloat(document.getElementById('productPrice').value),
            imagen: document.getElementById('productImage').value || 'https://via.placeholder.com/200x200?text=Sin+Imagen',
            distributor: document.getElementById('productDistributor').value,
            vencimiento: document.getElementById('productExpiration').value,
            ganancia: parseFloat(document.getElementById('productProfit').value) || 0,
            sucursales: sucursalStocks,
            stockTotal: totalStock
        };

        if (this.editingProductId) {
            const index = this.products.findIndex(p => p.codigo === this.editingProductId);
            if (index !== -1) {
                this.products[index] = product;
                this.showNotification('Producto actualizado correctamente', 'success');
            }
        } else {
            if (this.products.find(p => p.codigo === product.codigo)) {
                this.showNotification('Ya existe un producto con ese código', 'error');
                return;
            }
            this.products.push(product);
            this.showNotification('Producto agregado correctamente', 'success');
        }

        this.saveData();
        this.renderProducts();
        document.getElementById('productModal').classList.add('hidden');
    }

    // Delete product
    deleteProduct(codigo) {
        if (!this.hasPermission('delete')) {
            this.showNotification('No tienes permisos para eliminar productos', 'error');
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.products = this.products.filter(p => p.codigo !== codigo);
            this.saveData();
            this.renderProducts();
            this.showNotification('Producto eliminado correctamente', 'success');
        }
    }

    // User management functions
    openUserModal(user = null) {
        if (!this.hasPermission('manage_users')) {
            this.showNotification('No tienes permisos para gestionar usuarios', 'error');
            return;
        }

        this.editingUserId = user ? user.id : null;
        document.getElementById('userModalTitle').textContent = 
            user ? 'Editar Usuario' : 'Agregar Usuario';

        if (user) {
            document.getElementById('userName').value = user.usuario;
            document.getElementById('userFullName').value = user.nombre;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.rol;
            document.getElementById('userPassword').value = user.password;
        } else {
            document.getElementById('userForm').reset();
        }

        document.getElementById('userModal').classList.remove('hidden');
    }

    handleUserSubmit() {
        const user = {
            id: this.editingUserId || Date.now(),
            usuario: document.getElementById('userName').value,
            nombre: document.getElementById('userFullName').value,
            email: document.getElementById('userEmail').value,
            rol: document.getElementById('userRole').value,
            password: document.getElementById('userPassword').value
        };

        if (this.editingUserId) {
            const index = this.users.findIndex(u => u.id === this.editingUserId);
            if (index !== -1) {
                this.users[index] = user;
                this.showNotification('Usuario actualizado correctamente', 'success');
            }
        } else {
            if (this.users.find(u => u.usuario === user.usuario)) {
                this.showNotification('Ya existe un usuario con ese nombre', 'error');
                return;
            }
            this.users.push(user);
            this.showNotification('Usuario agregado correctamente', 'success');
        }

        this.saveData();
        this.renderUsers();
        document.getElementById('userModal').classList.add('hidden');
    }

    deleteUser(id) {
        if (id === 1) {
            this.showNotification('No puedes eliminar el usuario administrador principal', 'error');
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            this.users = this.users.filter(u => u.id !== id);
            this.saveData();
            this.renderUsers();
            this.showNotification('Usuario eliminado correctamente', 'success');
        }
    }

    // Distributor management functions
    openDistributorModal(distributor = null) {
        if (!this.hasPermission('manage_distributors')) {
            this.showNotification('No tienes permisos para gestionar distribuidores', 'error');
            return;
        }

        this.editingDistributorId = distributor ? distributor.id : null;
        document.getElementById('distributorModalTitle').textContent = 
            distributor ? 'Editar Distribuidor' : 'Agregar Distribuidor';

        if (distributor) {
            document.getElementById('distributorName').value = distributor.nombre;
            document.getElementById('distributorContact').value = distributor.contacto;
            document.getElementById('distributorPhone').value = distributor.telefono;
            document.getElementById('distributorEmail').value = distributor.email;
        } else {
            document.getElementById('distributorForm').reset();
        }

        document.getElementById('distributorModal').classList.remove('hidden');
    }

    handleDistributorSubmit() {
        const distributor = {
            id: this.editingDistributorId || Date.now(),
            nombre: document.getElementById('distributorName').value,
            contacto: document.getElementById('distributorContact').value,
            telefono: document.getElementById('distributorPhone').value,
            email: document.getElementById('distributorEmail').value
        };

        if (this.editingDistributorId) {
            const index = this.distributors.findIndex(d => d.id === this.editingDistributorId);
            if (index !== -1) {
                this.distributors[index] = distributor;
                this.showNotification('Distribuidor actualizado correctamente', 'success');
            }
        } else {
            this.distributors.push(distributor);
            this.showNotification('Distribuidor agregado correctamente', 'success');
        }

        this.saveData();
        this.renderDistributors();
        document.getElementById('distributorModal').classList.add('hidden');
    }

    deleteDistributor(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este distribuidor?')) {
            this.distributors = this.distributors.filter(d => d.id !== id);
            this.saveData();
            this.renderDistributors();
            this.showNotification('Distribuidor eliminado correctamente', 'success');
        }
    }

    // View sucursal details (user-facing) — replaces the older departamento namings
    viewSucursalDetails(sucursal) {
        const products = this.products.filter(p => p.sucursales && p.sucursales[sucursal] > 0);
        let details = `Detalles de la Sucursal ${sucursal}:\n\n`;
        
        if (products.length === 0) {
            details += 'No hay productos en esta sucursal.';
        } else {
            products.forEach(p => {
                const stock = p.sucursales[sucursal];
                const valor = stock * p.precio;
                details += `• ${p.nombre}: ${stock} unidades - $${valor.toFixed(2)}\n`;
            });
            
            const totalStock = products.reduce((sum, p) => sum + p.sucursales[sucursal], 0);
            const totalValue = products.reduce((sum, p) => sum + (p.sucursales[sucursal] * p.precio), 0);
            details += `\nResumen:\nTotal productos: ${products.length}\nStock total: ${totalStock}\nValor total: $${totalValue.toFixed(2)}`;
        }
        
        alert(details);
    }

    // Estructura completa de las 118 sucursales distribuidas en los 14 departamentos de El Salvador
    getBranchLocations() {
        return {
            'San Salvador': [
                { id: 'SS001', name: 'Super Selectos Centro Histórico', address: 'Av. Cuscatlán #1234, Centro Histórico, San Salvador', hours: 'Lun-Dom 06:00-22:00', phone: '+503 2222-1001', lat: 13.69294, lng: -89.21819, observations: 'Sucursal principal con estacionamiento propio' },
                { id: 'SS002', name: 'Super Selectos Multiplaza', address: 'Centro Comercial Multiplaza, Local 105, San Salvador', hours: 'Lun-Dom 08:00-22:00', phone: '+503 2222-1002', lat: 13.68632, lng: -89.20485, observations: 'Ubicado en centro comercial' },
                { id: 'SS003', name: 'Super Selectos Colonia Escalón', address: '85 Av. Norte #567, Col. Escalón, San Salvador', hours: 'Lun-Dom 07:00-21:00', phone: '+503 2222-1003', lat: 13.70833, lng: -89.22611, observations: 'Zona residencial exclusiva' },
                { id: 'SS004', name: 'Super Selectos San Benito', address: 'Paseo General Escalón #890, San Benito, San Salvador', hours: 'Lun-Dom 07:00-21:00', phone: '+503 2222-1004', lat: 13.70139, lng: -89.23194, observations: 'Cerca de zona financiera' },
                { id: 'SS005', name: 'Super Selectos Soyapango', address: 'Av. Las Flores #234, Soyapango, San Salvador', hours: 'Lun-Dom 06:30-21:30', phone: '+503 2222-1005', lat: 13.71667, lng: -89.13889, observations: 'Amplio parqueo disponible' },
                { id: 'SS006', name: 'Super Selectos Mejicanos', address: 'Calle Principal #456, Mejicanos, San Salvador', hours: 'Lun-Dom 07:00-21:00', phone: '+503 2222-1006', lat: 13.74056, lng: -89.20417, observations: 'Acceso por transporte público' },
                { id: 'SS007', name: 'Super Selectos Apopa', address: 'Carretera Troncal del Norte Km 12, Apopa, San Salvador', hours: 'Lun-Dom 06:00-21:00', phone: '+503 2222-1007', lat: 13.80722, lng: -89.18056, observations: 'En carretera principal' },
                { id: 'SS008', name: 'Super Selectos Ilopango', address: 'Av. Los Próceres #789, Ilopango, San Salvador', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2222-1008', lat: 13.70167, lng: -89.10861, observations: 'Cerca del aeropuerto' }
            ],
            'Usulután': [
                { id: 'US001', name: 'Super Selectos Usulután Centro', address: 'Calle Gerardo Barrios #123, Centro, Usulután', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2662-2001', lat: 13.35000, lng: -88.45000, observations: 'Sucursal principal del departamento' },
                { id: 'US002', name: 'Super Selectos Santiago de María', address: 'Av. José Matías Delgado #456, Santiago de María', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2662-2002', lat: 13.48333, lng: -88.46667, observations: 'Zona cafetalera' },
                { id: 'US003', name: 'Super Selectos Jiquilisco', address: 'Calle Principal #789, Jiquilisco, Usulután', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2662-2003', lat: 13.31667, lng: -88.58333, observations: 'Cerca de la bahía' },
                { id: 'US004', name: 'Super Selectos Berlín', address: 'Av. Central #234, Berlín, Usulután', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2662-2004', lat: 13.50000, lng: -88.53333, observations: 'Ruta del café' },
                { id: 'US005', name: 'Super Selectos Alegría', address: 'Calle del Comercio #567, Alegría, Usulután', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2662-2005', lat: 13.51667, lng: -88.50000, observations: 'Pueblo pintoresco' },
                { id: 'US006', name: 'Super Selectos Puerto El Triunfo', address: 'Malecón Turístico #890, Puerto El Triunfo', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2662-2006', lat: 13.27500, lng: -88.55000, observations: 'Puerto pesquero' },
                { id: 'US007', name: 'Super Selectos Ozatlán', address: 'Av. Principal #345, Ozatlán, Usulután', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2662-2007', lat: 13.36667, lng: -88.38333, observations: 'Zona agrícola' },
                { id: 'US008', name: 'Super Selectos Estanzuelas', address: 'Calle Central #678, Estanzuelas, Usulután', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2662-2008', lat: 13.41667, lng: -88.55000, observations: 'Área rural' },
                { id: 'US009', name: 'Super Selectos Tecapán', address: 'Carretera Litoral Km 98, Tecapán, Usulután', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2662-2009', lat: 13.30000, lng: -88.50000, observations: 'Zona costera' }
            ],
            'La Unión': [
                { id: 'LU001', name: 'Super Selectos La Unión Centro', address: 'Av. General Cabañas #123, Centro, La Unión', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2604-4001', lat: 13.33700, lng: -87.84600, observations: 'Puerto principal del oriente' },
                { id: 'LU002', name: 'Super Selectos Conchagua', address: 'Calle Principal #456, Conchagua, La Unión', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2604-4002', lat: 13.32500, lng: -87.90000, observations: 'Cerca del volcán' },
                { id: 'LU003', name: 'Super Selectos El Carmen', address: 'Av. Morazán #789, El Carmen, La Unión', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2604-4003', lat: 13.27500, lng: -87.98333, observations: 'Frontera con Honduras' },
                { id: 'LU004', name: 'Super Selectos Pasaquina', address: 'Calle del Comercio #234, Pasaquina, La Unión', hours: 'Lun-Dom 08:00-20:00', phone: '+503 2604-4004', lat: 13.41667, lng: -87.85000, observations: 'Zona fronteriza' },
                { id: 'LU005', name: 'Super Selectos Santa Rosa de Lima', address: 'Av. Central #567, Santa Rosa de Lima', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2604-4005', lat: 13.62500, lng: -87.90000, observations: 'Importante centro comercial' },
                { id: 'LU006', name: 'Super Selectos Anamoros', address: 'Calle Principal #890, Anamoros, La Unión', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2604-4006', lat: 13.73333, lng: -87.85000, observations: 'Zona fronteriza norte' },
                { id: 'LU007', name: 'Super Selectos Bolívar', address: 'Av. Las Américas #345, Bolívar, La Unión', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2604-4007', lat: 13.55000, lng: -87.96667, observations: 'Área montañosa' },
                { id: 'LU008', name: 'Super Selectos San Alejo', address: 'Carretera del Litoral Km 180, San Alejo', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2604-4008', lat: 13.25000, lng: -87.83333, observations: 'Playa cercana' }
            ],
            'La Libertad': [
                { id: 'LL001', name: 'Super Selectos Santa Tecla Centro', address: 'Av. José Napoleón Duarte #123, Santa Tecla', hours: 'Lun-Dom 06:00-22:00', phone: '+503 2228-3001', lat: 13.67317, lng: -89.27124, observations: 'Centro comercial principal' },
                { id: 'LL002', name: 'Super Selectos Antiguo Cuscatlán', address: 'Bulevar del Hipódromo #456, Antiguo Cuscatlán', hours: 'Lun-Dom 07:00-21:30', phone: '+503 2228-3002', lat: 13.66278, lng: -89.25194, observations: 'Zona exclusiva residencial' },
                { id: 'LL003', name: 'Super Selectos Puerto de La Libertad', address: 'Malecón Turístico #789, Puerto La Libertad', hours: 'Lun-Dom 07:00-21:00', phone: '+503 2228-3003', lat: 13.48833, lng: -89.32222, observations: 'Puerto turístico principal' },
                { id: 'LL004', name: 'Super Selectos Comasagua', address: 'Calle Principal #234, Comasagua, La Libertad', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2228-3004', lat: 13.73333, lng: -89.35000, observations: 'Zona montañosa' },
                { id: 'LL005', name: 'Super Selectos Colón', address: 'Av. Central #567, Colón, La Libertad', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2228-3005', lat: 13.70000, lng: -89.31667, observations: 'Área urbana' },
                { id: 'LL006', name: 'Super Selectos Quezaltepeque', address: 'Calle del Comercio #890, Quezaltepeque', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2228-3006', lat: 13.83333, lng: -89.28333, observations: 'Importante cruce vial' },
                { id: 'LL007', name: 'Super Selectos Tamanique', address: 'Carretera a las Playas #345, Tamanique', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2228-3007', lat: 13.51667, lng: -89.36667, observations: 'Ruta a playas del oeste' },
                { id: 'LL008', name: 'Super Selectos San Juan Opico', address: 'Av. Principal #678, San Juan Opico', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2228-3008', lat: 13.88333, lng: -89.35000, observations: 'Centro agropecuario' },
                { id: 'LL009', name: 'Super Selectos Chiltiupán', address: 'Calle Central #901, Chiltiupán, La Libertad', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2228-3009', lat: 13.76667, lng: -89.31667, observations: 'Zona rural' }
            ],
            'Morazán': [
                { id: 'MO001', name: 'Super Selectos San Francisco Gotera', address: 'Av. Morazán #123, San Francisco Gotera', hours: 'Lun-Dom 06:30-20:30', phone: '+503 2654-0001', lat: 13.58400, lng: -88.25400, observations: 'Cabecera departamental' },
                { id: 'MO002', name: 'Super Selectos Perquín', address: 'Calle Principal #456, Perquín, Morazán', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2654-0002', lat: 13.95000, lng: -88.16667, observations: 'Zona histórica de montaña' },
                { id: 'MO003', name: 'Super Selectos Arambala', address: 'Av. Central #789, Arambala, Morazán', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2654-0003', lat: 13.83333, lng: -88.10000, observations: 'Área montañosa del norte' },
                { id: 'MO004', name: 'Super Selectos Corinto', address: 'Calle del Comercio #234, Corinto, Morazán', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2654-0004', lat: 13.82500, lng: -88.21667, observations: 'Zona fronteriza con Honduras' },
                { id: 'MO005', name: 'Super Selectos Jocoaitique', address: 'Av. Las Flores #567, Jocoaitique, Morazán', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2654-0005', lat: 13.76667, lng: -88.28333, observations: 'Montaña norte del departamento' },
                { id: 'MO006', name: 'Super Selectos Sociedad', address: 'Calle Principal #890, Sociedad, Morazán', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2654-0006', lat: 13.71667, lng: -88.23333, observations: 'Centro agrícola' },
                { id: 'MO007', name: 'Super Selectos El Rosario', address: 'Av. Central #345, El Rosario, Morazán', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2654-0007', lat: 13.63333, lng: -88.20000, observations: 'Zona rural central' },
                { id: 'MO008', name: 'Super Selectos Jocoro', address: 'Carretera Principal #678, Jocoro, Morazán', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2654-0008', lat: 13.65000, lng: -88.06667, observations: 'Cerca de la frontera' }
            ],
            'Cabañas': [
                { id: 'CB001', name: 'Super Selectos Sensuntepeque', address: 'Av. José Simeón Cañas #123, Sensuntepeque', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2335-1001', lat: 13.81100, lng: -88.64800, observations: 'Cabecera departamental' },
                { id: 'CB002', name: 'Super Selectos Ilobasco', address: 'Calle de los Artesanos #456, Ilobasco, Cabañas', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2335-1002', lat: 13.84167, lng: -88.86667, observations: 'Ciudad de las cerámicas' },
                { id: 'CB003', name: 'Super Selectos Victoria', address: 'Av. Central #789, Victoria, Cabañas', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2335-1003', lat: 13.83333, lng: -88.61667, observations: 'Centro agrícola del norte' },
                { id: 'CB004', name: 'Super Selectos Tejutepeque', address: 'Calle Principal #234, Tejutepeque, Cabañas', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2335-1004', lat: 13.78333, lng: -88.90000, observations: 'Zona ganadera' },
                { id: 'CB005', name: 'Super Selectos Jutiapa', address: 'Av. Las Flores #567, Jutiapa, Cabañas', hours: 'Lun-Dom 07:00-19:00', phone: '+503 2335-1005', lat: 13.75000, lng: -88.68333, observations: 'Área rural montañosa' },
                { id: 'CB006', name: 'Super Selectos Dolores', address: 'Calle del Comercio #890, Dolores, Cabañas', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2335-1006', lat: 13.80000, lng: -88.71667, observations: 'Centro del departamento' },
                { id: 'CB007', name: 'Super Selectos Cinquera', address: 'Av. Principal #345, Cinquera, Cabañas', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2335-1007', lat: 13.73333, lng: -88.75000, observations: 'Zona montañosa del sur' },
                { id: 'CB008', name: 'Super Selectos San Isidro', address: 'Carretera Central #678, San Isidro, Cabañas', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2335-1008', lat: 13.86667, lng: -88.58333, observations: 'Cruce de carreteras importantes' }
            ],
            'San Miguel': [
                { id: 'SM001', name: 'Super Selectos San Miguel Centro', address: 'Av. Roosevelt #123, Centro, San Miguel', hours: 'Lun-Dom 06:00-22:00', phone: '+503 2661-1001', lat: 13.48333, lng: -88.18333, observations: 'Sucursal principal del oriente' },
                { id: 'SM002', name: 'Super Selectos Metrocentro San Miguel', address: 'Centro Comercial Metrocentro, San Miguel', hours: 'Lun-Dom 08:00-22:00', phone: '+503 2661-1002', lat: 13.48000, lng: -88.17500, observations: 'En centro comercial principal' },
                { id: 'SM003', name: 'Super Selectos Ciudad Pacifica', address: 'Residencial Ciudad Pacifica, San Miguel', hours: 'Lun-Dom 07:00-21:00', phone: '+503 2661-1003', lat: 13.47000, lng: -88.16000, observations: 'Zona residencial nueva' },
                { id: 'SM004', name: 'Super Selectos Moncagua', address: 'Av. Las Palmeras #456, Moncagua, San Miguel', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2661-1004', lat: 13.45000, lng: -88.20000, observations: 'Área metropolitana' },
                { id: 'SM005', name: 'Super Selectos Chinameca', address: 'Calle Principal #789, Chinameca, San Miguel', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2661-1005', lat: 13.50000, lng: -88.35000, observations: 'Al pie del volcán' },
                { id: 'SM006', name: 'Super Selectos Nueva Guadalupe', address: 'Av. Central #234, Nueva Guadalupe, San Miguel', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2661-1006', lat: 13.41667, lng: -88.25000, observations: 'Zona agrícola del sur' },
                { id: 'SM007', name: 'Super Selectos Sesori', address: 'Carretera a Sesori #567, San Miguel', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2661-1007', lat: 13.53333, lng: -88.30000, observations: 'Ruta hacia las montañas' },
                { id: 'SM008', name: 'Super Selectos Uluazapa', address: 'Calle del Comercio #890, Uluazapa, San Miguel', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2661-1008', lat: 13.36667, lng: -88.16667, observations: 'Zona fronteriza sur' },
                { id: 'SM009', name: 'Super Selectos Chirilagua', address: 'Av. Las Flores #345, Chirilagua, San Miguel', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2661-1009', lat: 13.18333, lng: -88.11667, observations: 'Cerca del Golfo de Fonseca' }
            ],
            'Sonsonate': [
                { id: 'SO001', name: 'Super Selectos Sonsonate Centro', address: 'Av. Rafael Campo #123, Centro, Sonsonate', hours: 'Lun-Dom 06:30-21:30', phone: '+503 2451-2001', lat: 13.71889, lng: -89.72444, observations: 'Centro histórico colonial' },
                { id: 'SO002', name: 'Super Selectos Acajutla', address: 'Puerto de Acajutla #456, Acajutla, Sonsonate', hours: 'Lun-Dom 07:00-21:00', phone: '+503 2451-2002', lat: 13.59278, lng: -89.82750, observations: 'Puerto comercial principal' },
                { id: 'SO003', name: 'Super Selectos Izalco', address: 'Calle de los Volcanes #789, Izalco, Sonsonate', hours: 'Lun-Dom 07:30-20:30', phone: '+503 2451-2003', lat: 13.74500, lng: -89.67333, observations: 'Ciudad histórica indígena' },
                { id: 'SO004', name: 'Super Selectos Nahuizalco', address: 'Av. de las Artesanías #234, Nahuizalco', hours: 'Lun-Dom 08:00-20:00', phone: '+503 2451-2004', lat: 13.78333, lng: -89.73333, observations: 'Centro de artesanías' },
                { id: 'SO005', name: 'Super Selectos Juayúa', address: 'Calle Mercedes Cáceres #567, Juayúa', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2451-2005', lat: 13.84167, lng: -89.74500, observations: 'Ruta de las Flores' },
                { id: 'SO006', name: 'Super Selectos Salcoatitán', address: 'Av. Central #890, Salcoatitán, Sonsonate', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2451-2006', lat: 13.83000, lng: -89.79000, observations: 'Pueblo de montaña' },
                { id: 'SO007', name: 'Super Selectos Santa Catarina Masahuat', address: 'Calle Principal #345, Santa Catarina Masahuat', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2451-2007', lat: 13.76667, lng: -89.80000, observations: 'Comunidad indígena' },
                { id: 'SO008', name: 'Super Selectos Armenia', address: 'Carretera del Café #678, Armenia, Sonsonate', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2451-2008', lat: 13.75000, lng: -89.50000, observations: 'Zona cafetalera' },
                { id: 'SO009', name: 'Super Selectos Santa Isabel Ishuatán', address: 'Av. Las Palmeras #901, Santa Isabel Ishuatán', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2451-2009', lat: 13.55000, lng: -89.75000, observations: 'Cerca de la costa' }
            ],
            'La Paz': [
                { id: 'LP001', name: 'Super Selectos Zacatecoluca', address: 'Av. Gerardo Barrios #123, Zacatecoluca', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2334-0001', lat: 13.50167, lng: -88.86500, observations: 'Cabecera departamental' },
                { id: 'LP002', name: 'Super Selectos Cojutepeque', address: 'Calle José Simeón Cañas #456, Cojutepeque', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2334-0002', lat: 13.71667, lng: -88.93333, observations: 'Centro comercial regional' },
                { id: 'LP003', name: 'Super Selectos San Pedro Masahuat', address: 'Av. Central #789, San Pedro Masahuat', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2334-0003', lat: 13.43333, lng: -88.95000, observations: 'Zona costera del sur' },
                { id: 'LP004', name: 'Super Selectos Olocuilta', address: 'Carretera Panamericana Km 34 #234, Olocuilta', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2334-0004', lat: 13.58333, lng: -89.11667, observations: 'Famoso por las pupusas' },
                { id: 'LP005', name: 'Super Selectos San Juan Tepezontes', address: 'Calle del Comercio #567, San Juan Tepezontes', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2334-0005', lat: 13.65000, lng: -88.83333, observations: 'Zona montañosa central' },
                { id: 'LP006', name: 'Super Selectos Paraíso de Osorio', address: 'Av. Las Flores #890, Paraíso de Osorio', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2334-0006', lat: 13.61667, lng: -88.96667, observations: 'Área rural del norte' },
                { id: 'LP007', name: 'Super Selectos San Rafael Obrajuelo', address: 'Calle Principal #345, San Rafael Obrajuelo', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2334-0007', lat: 13.73333, lng: -88.81667, observations: 'Zona agrícola' },
                { id: 'LP008', name: 'Super Selectos Tapalhuaca', address: 'Av. Central #678, Tapalhuaca, La Paz', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2334-0008', lat: 13.55000, lng: -88.78333, observations: 'Centro del departamento' }
            ],
            'Ahuachapán': [
                { id: 'AH001', name: 'Super Selectos Ahuachapán Centro', address: 'Av. Francisco Menéndez #123, Centro, Ahuachapán', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2413-3001', lat: 13.92156, lng: -89.83489, observations: 'Cabecera fronteriza oeste' },
                { id: 'AH002', name: 'Super Selectos Ataco', address: 'Calle Real de Ataco #456, Ataco, Ahuachapán', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2413-3002', lat: 13.87167, lng: -89.85000, observations: 'Concepción de Ataco, Ruta de las Flores' },
                { id: 'AH003', name: 'Super Selectos Apaneca', address: 'Av. de los Volcanes #789, Apaneca, Ahuachapán', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2413-3003', lat: 13.85333, lng: -89.80667, observations: 'Clima frío de montaña' },
                { id: 'AH004', name: 'Super Selectos Tacuba', address: 'Calle Principal #234, Tacuba, Ahuachapán', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2413-3004', lat: 13.95000, lng: -89.95000, observations: 'Zona fronteriza norte' },
                { id: 'AH005', name: 'Super Selectos El Refugio', address: 'Av. Las Flores #567, El Refugio, Ahuachapán', hours: 'Lun-Dom 07:00-19:00', phone: '+503 2413-3005', lat: 13.96667, lng: -89.80000, observations: 'Área montañosa del norte' },
                { id: 'AH006', name: 'Super Selectos Guaymango', address: 'Calle del Comercio #890, Guaymango, Ahuachapán', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2413-3006', lat: 13.88333, lng: -89.96667, observations: 'Zona fronteriza oeste' },
                { id: 'AH007', name: 'Super Selectos Jujutla', address: 'Carretera Costera #345, Jujutla, Ahuachapán', hours: 'Lun-Dom 08:00-20:00', phone: '+503 2413-3007', lat: 13.85000, lng: -90.00000, observations: 'Cerca del océano Pacífico' },
                { id: 'AH008', name: 'Super Selectos San Lorenzo', address: 'Av. Central #678, San Lorenzo, Ahuachapán', hours: 'Lun-Dom 07:00-19:30', phone: '+503 2413-3008', lat: 13.98333, lng: -89.88333, observations: 'Zona rural norte' },
                { id: 'AH009', name: 'Super Selectos San Francisco Menéndez', address: 'Calle Fronteriza #901, San Francisco Menéndez', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2413-3009', lat: 14.05000, lng: -89.83333, observations: 'Frontera con Guatemala' }
            ],
            'Chalatenango': [
                { id: 'CH001', name: 'Super Selectos Chalatenango Centro', address: 'Av. Libertad #123, Centro, Chalatenango', hours: 'Lun-Dom 06:30-20:30', phone: '+503 2301-2001', lat: 14.03222, lng: -89.00333, observations: 'Cabecera del norte montañoso' },
                { id: 'CH002', name: 'Super Selectos Nueva Concepción', address: 'Calle Principal #456, Nueva Concepción', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2301-2002', lat: 14.13333, lng: -89.31667, observations: 'Zona fronteriza norte' },
                { id: 'CH003', name: 'Super Selectos La Palma', address: 'Av. de los Artistas #789, La Palma, Chalatenango', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2301-2003', lat: 14.30000, lng: -89.16667, observations: 'Ciudad de las artesanías' },
                { id: 'CH004', name: 'Super Selectos Tejutla', address: 'Calle Central #234, Tejutla, Chalatenango', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2301-2004', lat: 14.15000, lng: -89.05000, observations: 'Centro del departamento' },
                { id: 'CH005', name: 'Super Selectos San Ignacio', address: 'Av. Las Flores #567, San Ignacio, Chalatenango', hours: 'Lun-Dom 07:00-19:30', phone: '+503 2301-2005', lat: 14.16667, lng: -89.13333, observations: 'Zona montañosa central' },
                { id: 'CH006', name: 'Super Selectos Dulce Nombre de María', address: 'Calle del Comercio #890, Dulce Nombre de María', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2301-2006', lat: 14.03333, lng: -88.95000, observations: 'Este del departamento' },
                { id: 'CH007', name: 'Super Selectos Agua Caliente', address: 'Carretera Fronteriza #345, Agua Caliente', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2301-2007', lat: 14.35000, lng: -89.20000, observations: 'Frontera con Honduras' },
                { id: 'CH008', name: 'Super Selectos Citalá', address: 'Av. Principal #678, Citalá, Chalatenango', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2301-2008', lat: 14.38333, lng: -89.05000, observations: 'Punto más al norte del país' }
            ],
            'Santa Ana': [
                { id: 'SA001', name: 'Super Selectos Santa Ana Centro', address: '2a. Calle pte. Y 2a. Av. Nte.# 5, Santa Ana', hours: 'Lun-Sáb 07:00-22:00, Dom 21:00', phone: '2213-6325', lat: 13.994800, lng: -89.570000, observations: 'Centro histórico de Santa Ana' },
                { id: 'SA002', name: 'Super Selectos Metrocentro Santa Ana', address: 'Centro Comercial Metrocentro. Santa Ana.', hours: 'Lun-Sáb 08:00-22:00, Dom 21:00', phone: '2213-6331', lat: 13.98889, lng: -89.56111, observations: 'Principal centro comercial' },
                { id: 'SA003', name: 'Super Selectos Santa Ana Colón', address: 'Av. Moraga Sur y 11 Calle Poniente. Santa Ana', hours: 'Lun-Sáb 08:00-22:00, Dom 21:00', phone: '2213-6314', lat: 13.98750, lng: -89.56250, observations: 'Zona comercial de Colón' },
                { id: 'SA004', name: 'Super Selectos Chalchuapa', address: 'Callejón Santa #1-Bis, Chalchuapa Santa Ana', hours: 'Lun-Dom 07:00-20:30', phone: '2213-6359', lat: 13.98611, lng: -89.68528, observations: 'Centro de Chalchuapa' },
                { id: 'SA005', name: 'Super Selectos Ciudad Real', address: 'Canton Los Amate, Ciudad Real Jurisdiccion de san sebastian chalchuapa Santa Ana', hours: 'Lun-Sáb 08:00-22:00, Dom 21:00', phone: '2213-6370', lat: 13.994100, lng: -89.559000, observations: 'Ciudad Real, Santa Ana' },
                { id: 'SA006', name: 'Super Selectos Las Ramblas Santa Ana', address: 'Centro Comercial Las Ramblas Santa Ana. Local Ancla 6 sobre carretera panamericana y calle portezuelo, Cantón Comecayo, Santa Ana', hours: 'Lun-Sáb 08:00-22:00, Dom 21:00', phone: '2213-7607', lat: 13.994500, lng: -89.567000, observations: 'Lotificación Bello Horizontes, Santa Ana' },
                { id: 'SA007', name: 'Super Selectos Metapán', address: 'Carretera a Guatemala, EX Cine Orellana de Metapán', hours: 'Lun-Dom 07:00-22:00', phone: '2213-6361', lat: 14.33056, lng: -89.44722, observations: 'Centro de Metapán' },
                { id: 'SA008', name: 'Super Selectos Coatepeque', address: 'Calle del Lago #234, Coatepeque, Santa Ana', hours: 'Lun-Dom 07:30-20:30', phone: '+503 2447-1005', lat: 13.91667, lng: -89.50000, observations: 'Orillas del lago Coatepeque' },
                { id: 'SA009', name: 'Super Selectos Texistepeque', address: 'Calle Principal #890, Texistepeque, Santa Ana', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2447-1007', lat: 14.17778, lng: -89.49444, observations: 'Centro de Texistepeque' },
                { id: 'SA010', name: 'Super Selectos El Congo', address: 'Carretera del Café #345, El Congo, Santa Ana', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2447-1008', lat: 14.04167, lng: -89.65000, observations: 'Centro de El Congo' },
                { id: 'SA011', name: 'Super Selectos Candelaria de la Frontera', address: 'Av. Fronteriza #678, Candelaria de la Frontera', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2447-1009', lat: 14.26389, lng: -89.66667, observations: 'Centro de Candelaria de la Frontera' },
                { id: 'SA012', name: 'Super Selectos Masahuat', address: 'Calle Central #901, Masahuat, Santa Ana', hours: 'Lun-Dom 07:30-19:00', phone: '+503 2447-1010', lat: 14.20000, lng: -89.60000, observations: 'Centro de Masahuat' }
            ],
            'San Vicente': [
                { id: 'SV001', name: 'Super Selectos San Vicente Centro', address: 'Av. José Matías Delgado #123, San Vicente', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2393-4001', lat: 13.63333, lng: -88.78333, observations: 'Cabecera del Volcán San Vicente' },
                { id: 'SV002', name: 'Super Selectos Tecoluca', address: 'Calle Principal #456, Tecoluca, San Vicente', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2393-4002', lat: 13.78333, lng: -88.83333, observations: 'Norte del departamento' },
                { id: 'SV003', name: 'Super Selectos Guadalupe', address: 'Av. Central #789, Guadalupe, San Vicente', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2393-4003', lat: 13.73333, lng: -88.75000, observations: 'Zona central montañosa' },
                { id: 'SV004', name: 'Super Selectos Apastepeque', address: 'Calle del Comercio #234, Apastepeque, San Vicente', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2393-4004', lat: 13.71667, lng: -88.76667, observations: 'Área rural del norte' },
                { id: 'SV005', name: 'Super Selectos Santa Clara', address: 'Av. Las Flores #567, Santa Clara, San Vicente', hours: 'Lun-Dom 07:00-19:00', phone: '+503 2393-4005', lat: 13.61667, lng: -88.71667, observations: 'Sur del departamento' },
                { id: 'SV006', name: 'Super Selectos Santo Domingo', address: 'Carretera Central #890, Santo Domingo, San Vicente', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2393-4006', lat: 13.65000, lng: -88.80000, observations: 'Centro geográfico del país' },
                { id: 'SV007', name: 'Super Selectos San Esteban Catarina', address: 'Calle Principal #345, San Esteban Catarina', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2393-4007', lat: 13.58333, lng: -88.83333, observations: 'Zona volcánica sur' },
                { id: 'SV008', name: 'Super Selectos San Ildefonso', address: 'Av. Central #678, San Ildefonso, San Vicente', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2393-4008', lat: 13.70000, lng: -88.85000, observations: 'Oeste del departamento' },
                { id: 'SV009', name: 'Super Selectos Tepetitán', address: 'Calle del Valle #901, Tepetitán, San Vicente', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2393-4009', lat: 13.68333, lng: -88.73333, observations: 'Valle central del departamento' },
                { id: 'SV010', name: 'Super Selectos Verapaz', address: 'Carretera del Norte #234, Verapaz, San Vicente', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2393-4010', lat: 13.76667, lng: -88.80000, observations: 'Límite norte del departamento' }
            ],
            'Cuscatlán': [
                { id: 'CU001', name: 'Super Selectos Cojutepeque Centro', address: 'Av. José Simeón Cañas #123, Cojutepeque', hours: 'Lun-Dom 06:30-21:00', phone: '+503 2372-1001', lat: 13.71667, lng: -88.93333, observations: 'Cabecera departamental' },
                { id: 'CU002', name: 'Super Selectos Suchitoto', address: 'Calle del Lago Suchitlán #456, Suchitoto', hours: 'Lun-Dom 07:00-20:30', phone: '+503 2372-1002', lat: 13.93833, lng: -89.02750, observations: 'Pueblo colonial y lago' },
                { id: 'CU003', name: 'Super Selectos San Pedro Perulapán', address: 'Av. Central #789, San Pedro Perulapán', hours: 'Lun-Dom 07:30-20:00', phone: '+503 2372-1003', lat: 13.75000, lng: -88.90000, observations: 'Norte del departamento' },
                { id: 'CU004', name: 'Super Selectos Tenancingo', address: 'Calle Principal #234, Tenancingo, Cuscatlán', hours: 'Lun-Dom 08:00-19:30', phone: '+503 2372-1004', lat: 13.86667, lng: -88.98333, observations: 'Área del lago artificial' },
                { id: 'CU005', name: 'Super Selectos San Rafael Cedros', address: 'Av. Las Flores #567, San Rafael Cedros', hours: 'Lun-Dom 07:00-19:00', phone: '+503 2372-1005', lat: 13.68333, lng: -88.95000, observations: 'Sur del departamento' },
                { id: 'CU006', name: 'Super Selectos Candelaria', address: 'Calle del Comercio #890, Candelaria, Cuscatlán', hours: 'Lun-Dom 07:30-19:30', phone: '+503 2372-1006', lat: 13.81667, lng: -89.05000, observations: 'Oeste del departamento' },
                { id: 'CU007', name: 'Super Selectos San José Guayabal', address: 'Carretera del Centro #345, San José Guayabal', hours: 'Lun-Dom 08:00-19:00', phone: '+503 2372-1007', lat: 13.66667, lng: -88.88333, observations: 'Centro-sur del departamento' },
                { id: 'CU008', name: 'Super Selectos Monte San Juan', address: 'Av. de la Montaña #678, Monte San Juan', hours: 'Lun-Dom 07:00-20:00', phone: '+503 2372-1008', lat: 13.90000, lng: -88.91667, observations: 'Zona montañosa norte' }
            ]
        };
    }

    // Initialize Leaflet map and markers
    initMap() {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined' || !window.L) {
            console.error('Leaflet is not loaded');
            this.showNotification('Error: Leaflet no está cargado. Verifica tu conexión a internet.', 'error');
            // Show alternative content
            document.getElementById('map').innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f5f5f5;border:2px dashed #ccc;flex-direction:column;text-align:center;padding:20px;">
                    <h3 style="color:#666;margin-bottom:10px">🗺️ Mapa no disponible</h3>
                    <p style="color:#888;margin-bottom:15px">Leaflet.js no se pudo cargar desde el CDN</p>
                    <p style="color:#888;font-size:14px">Verifica tu conexión a internet e intenta recargar la página</p>
                    <button onclick="location.reload()" style="margin-top:15px;padding:8px 16px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer">Recargar Página</button>
                </div>
            `;
            return;
        }

        try {
            // Center of El Salvador
            const center = [13.794185, -88.896529];
            this.map = L.map('map', { 
                center: center, 
                zoom: 8, 
                minZoom: 7,
                maxZoom: 18
            });

            // OSM tiles (online). For offline use replace tileUrl with local tiles.
            const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const tileLayer = L.tileLayer(tileUrl, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            });

            tileLayer.on('tileerror', (e) => {
                console.warn('Error loading map tiles:', e);
                this.showNotification('Algunos tiles del mapa no se pudieron cargar', 'warning');
            });

            tileLayer.addTo(this.map);

            this.markersLayer = L.layerGroup().addTo(this.map);
            this.markersById = {};

            // Load branch locations
            // Cargar todas las sucursales de todos los departamentos
            const allBranches = this.getBranchLocations();
            this.branchLocations = [];
            this.markersById = {};

            // Iterar sobre cada departamento y sus sucursales
            Object.keys(allBranches).forEach(department => {
                allBranches[department].forEach(branch => {
                    this.branchLocations.push(branch);
                    
                    // Crear marcador personalizado
                    const customIcon = L.divIcon({
                        html: `
                            <div class="custom-marker">
                                <div class="marker-icon">🏪</div>
                            </div>
                        `,
                        className: 'super-selectos-marker',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    });

                    const marker = L.marker([branch.lat, branch.lng], { icon: customIcon }).addTo(this.markersLayer);
                    
                    const popupHtml = `
                        <div class="branch-popup">
                            <div class="popup-header">
                                <strong>${branch.name}</strong>
                                <span class="popup-department">${department}</span>
                            </div>
                            <div class="popup-content">
                                <div class="popup-item">📍 ${branch.address}</div>
                                <div class="popup-item">🕒 ${branch.hours}</div>
                                <div class="popup-item">📞 ${branch.phone}</div>
                                ${branch.observations ? `<div class="popup-item">📝 ${branch.observations}</div>` : ''}
                            </div>
                        </div>
                    `;
                    
                    marker.bindPopup(popupHtml, { maxWidth: 300 });
                    this.markersById[branch.id] = { marker, branch, department };
                });
            });

            this.showNotification('Mapa cargado correctamente', 'success');
            
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showNotification('Error al inicializar el mapa: ' + error.message, 'error');
            document.getElementById('map').innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f5f5f5;border:2px dashed #ccc;flex-direction:column;text-align:center;padding:20px;">
                    <h3 style="color:#666;margin-bottom:10px">🗺️ Error en el mapa</h3>
                    <p style="color:#888;margin-bottom:15px">No se pudo inicializar Leaflet</p>
                    <p style="color:#888;font-size:14px">Error: ${error.message}</p>
                    <button onclick="location.reload()" style="margin-top:15px;padding:8px 16px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer">Recargar Página</button>
                </div>
            `;
        }
    }

    // Populate the left list of branches and wire search
    populateMapList() {
        const results = document.getElementById('mapResults');
        const input = document.getElementById('mapSearchInput');
        if (!results || !input) return;

        const branches = this.branchLocations || [];

        const renderBranches = (list) => {
            results.innerHTML = '';
            list.forEach(b => {
                const div = document.createElement('div');
                div.className = 'map-result-item';
                div.innerHTML = `
                    <div class="map-result-title">${b.name}</div>
                    <div class="map-result-sub">${b.address}</div>
                    <div class="map-result-sub">Horario: ${b.hours} • Tel: ${b.phone}</div>
                    <div style="margin-top:8px"><button class="btn-primary btn-small" onclick="inventory.centerOnMarker('${b.id}')">Ver en mapa</button></div>
                `;
                results.appendChild(div);
            });
        };

        // Initial render
        renderBranches(branches);

        // Search handler
        if (!input.hasAttribute('data-search-listener')) {
            input.addEventListener('input', () => {
                const q = input.value.trim().toLowerCase();
                const filtered = branches.filter(b => 
                    b.name.toLowerCase().includes(q) || 
                    b.address.toLowerCase().includes(q) ||
                    (this.markersById[b.id] && this.markersById[b.id].department.toLowerCase().includes(q))
                );
                renderBranches(filtered);
            });
            input.setAttribute('data-search-listener', 'true');
        }
    }

    // Center map and open popup for marker id
    centerOnMarker(id) {
        const entry = this.markersById && this.markersById[id];
        if (!entry) return;
        const { marker } = entry;
        this.map.setView(marker.getLatLng(), 14, { animate: true });
        marker.openPopup();
    }

    // Mostrar sucursal específica en el mapa (desde botón "Ver mapa")
    showBranchOnMap(branchId) {
        // Cambiar a la sección del mapa si no estamos allí
        this.showSection('map');
        
        // Esperar a que el mapa se inicialice completamente
        setTimeout(() => {
            if (!this.map) {
                this.initMap();
            }
            
            // Centrar en la sucursal específica
            setTimeout(() => {
                const entry = this.markersById && this.markersById[branchId];
                if (entry) {
                    const { marker, branch, department } = entry;
                    
                    // Centrar el mapa en la sucursal con un zoom apropiado
                    this.map.setView(marker.getLatLng(), 16, { animate: true, duration: 1 });
                    
                    // Abrir el popup de la sucursal
                    marker.openPopup();
                    
                    // Mostrar notificación
                    this.showNotification(`Mostrando ${branch.name} en ${department}`, 'success');
                } else {
                    this.showNotification('No se encontró la ubicación de la sucursal', 'error');
                }
            }, 300);
        }, 200);
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Toggle showing all products for a branch
    toggleAllProducts(sucursalFilter) {
        const branchKey = `Sucursal ${sucursalFilter}`;
        const branchProducts = this.products.filter(p => (p.sucursales?.[branchKey] || 0) > 0);
        const stockList = document.getElementById('branchStockList');
        const moreButton = document.querySelector('.btn-more');
        
        if (!stockList || !moreButton) return;
        
        const isExpanded = moreButton.textContent.includes('menos');
        
        if (isExpanded) {
            // Collapse - show only first 5
            stockList.innerHTML = branchProducts.slice(0, 5).map(p => `
                <div class="branch-stock-item">
                    <span class="product-name">${p.nombre}</span>
                    <span class="product-stock">${p.sucursales[branchKey]} unidades</span>
                </div>
            `).join('');
            moreButton.textContent = `+ ${branchProducts.length - 5} más productos`;
        } else {
            // Expand - show all products
            stockList.innerHTML = branchProducts.map(p => `
                <div class="branch-stock-item">
                    <span class="product-name">${p.nombre}</span>
                    <span class="product-stock">${p.sucursales[branchKey]} unidades</span>
                    <span class="product-price">$${p.precio.toFixed(2)} c/u</span>
                </div>
            `).join('');
            moreButton.textContent = '- Mostrar menos';
        }
    }

    // Show notification
    showNotification(message, type = 'success', autoRemove = true) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.getElementById('notifications').appendChild(notification);

        if (autoRemove) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }

        return notification;
    }
}

// Initialize the system
const inventory = new InventorySystem();