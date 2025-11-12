-- =====================================================
-- DATOS INICIALES SUPER SELECTOS INVENTORY SYSTEM
-- Versión: 2.5.1
-- Autor: David
-- Fecha: 2025-10-28
-- =====================================================

-- =====================================================
-- USUARIOS INICIALES
-- =====================================================

-- Admin principal
INSERT INTO users (username, password, full_name, email, role, active, account_non_expired, account_non_locked, credentials_non_expired, created_at, updated_at) VALUES 
('admin', '$2a$12$LwCqxl6EhFnkKrJI8mXoVOtqNg8J5H.K8.QjKqJHqN4R2vVzJV1Z6', 'Administrador del Sistema', 'admin@superselectos.com', 'ADMIN', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Gerentes
INSERT INTO users (username, password, full_name, email, role, active, account_non_expired, account_non_locked, credentials_non_expired, created_at, updated_at) VALUES 
('manager', '$2a$12$LwCqxl6EhFnkKrJI8mXoVOtqNg8J5H.K8.QjKqJHqN4R2vVzJV1Z6', 'María González', 'maria.gonzalez@superselectos.com', 'MANAGER', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('manager2', '$2a$12$LwCqxl6EhFnkKrJI8mXoVOtqNg8J5H.K8.QjKqJHqN4R2vVzJV1Z6', 'Carlos Martínez', 'carlos.martinez@superselectos.com', 'MANAGER', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Empleados
INSERT INTO users (username, password, full_name, email, role, active, account_non_expired, account_non_locked, credentials_non_expired, created_at, updated_at) VALUES 
('employee', '$2a$12$LwCqxl6EhFnkKrJI8mXoVOtqNg8J5H.K8.QjKqJHqN4R2vVzJV1Z6', 'Ana López', 'ana.lopez@superselectos.com', 'EMPLOYEE', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('employee2', '$2a$12$LwCqxl6EhFnkKrJI8mXoVOtqNg8J5H.K8.QjKqJHqN4R2vVzJV1Z6', 'Roberto Silva', 'roberto.silva@superselectos.com', 'EMPLOYEE', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- DISTRIBUIDORES
-- =====================================================
INSERT INTO distributors (name, contact_person, phone, email, address, city, country, active, created_at, updated_at) VALUES 
('Distribuidora Central S.A.', 'Juan Pérez', '+503 2234-5678', 'contacto@distcentral.com', 'Km 10.5 Carretera a Santa Ana', 'San Salvador', 'El Salvador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alimentos del Valle', 'Ana López', '+503 2345-6789', 'ventas@alimentosvalle.com', 'Boulevard Constitución #245', 'San Salvador', 'El Salvador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bebidas Premium S.A.', 'Roberto Silva', '+503 2456-7890', 'info@bebidaspremium.com', 'Zona Industrial La Sultana', 'Antiguo Cuscatlán', 'El Salvador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carnes Selectas', 'María Rodríguez', '+503 2567-8901', 'pedidos@carnesselectas.com', 'Mercado Central Local 15-20', 'San Salvador', 'El Salvador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Frutas Frescas S.A.', 'Pedro Hernández', '+503 2678-9012', 'ventas@frutasfrescas.com', 'Carretera Panamericana Km 25', 'Santa Tecla', 'El Salvador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Productos de Limpieza El Sol', 'Carmen Flores', '+503 2789-0123', 'carmen@limpiezaelsol.com', 'Col. Escalón, Av. Masferrer', 'San Salvador', 'El Salvador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- SUCURSALES (118 sucursales por todo El Salvador)
-- =====================================================

-- San Salvador
INSERT INTO branches (branch_number, name, address, city, department, phone, manager_name, latitude, longitude, active, opening_hours, created_at, updated_at) VALUES 
(1, 'Centro San Salvador', 'Av. Cuscatlán y 4a Calle Oriente', 'San Salvador', 'San Salvador', '+503 2222-1001', 'Luis Martínez', 13.6929, -89.2182, true, 'Lunes a Domingo: 6:00 AM - 10:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Metrocentro', 'Centro Comercial Metrocentro', 'San Salvador', 'San Salvador', '+503 2222-1002', 'Patricia Vásquez', 13.6954, -89.2195, true, 'Lunes a Domingo: 8:00 AM - 10:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Plaza Mundo', 'Centro Comercial Plaza Mundo', 'San Salvador', 'San Salvador', '+503 2222-1003', 'Roberto Campos', 13.6845, -89.2023, true, 'Lunes a Domingo: 8:00 AM - 9:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Escalón', 'Col. Escalón, Av. Masferrer Norte', 'San Salvador', 'San Salvador', '+503 2222-1004', 'Carmen Solís', 13.7098, -89.2236, true, 'Lunes a Domingo: 6:30 AM - 10:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Multiplaza', 'Centro Comercial Multiplaza', 'San Salvador', 'San Salvador', '+503 2222-1005', 'Andrea Morales', 13.6743, -89.2456, true, 'Lunes a Domingo: 8:00 AM - 10:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Santa Ana
INSERT INTO branches (branch_number, name, address, city, department, phone, manager_name, latitude, longitude, active, opening_hours, created_at, updated_at) VALUES 
(6, 'Centro Santa Ana', 'Av. Independencia Sur #5', 'Santa Ana', 'Santa Ana', '+503 2441-1006', 'Miguel Rosales', 13.9942, -89.5583, true, 'Lunes a Domingo: 6:00 AM - 9:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Metrocentro Santa Ana', 'Centro Comercial Metrocentro Oeste', 'Santa Ana', 'Santa Ana', '+503 2441-1007', 'Elena Castillo', 13.9845, -89.5456, true, 'Lunes a Domingo: 8:00 AM - 10:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Colonia Roma', 'Col. Roma, 15 Av. Sur', 'Santa Ana', 'Santa Ana', '+503 2441-1008', 'José Ramírez', 13.9756, -89.5612, true, 'Lunes a Domingo: 6:30 AM - 9:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- San Miguel
INSERT INTO branches (branch_number, name, address, city, department, phone, manager_name, latitude, longitude, active, opening_hours, created_at, updated_at) VALUES 
(9, 'Centro San Miguel', 'Av. Roosevelt y 4a Calle Poniente', 'San Miguel', 'San Miguel', '+503 2661-1009', 'Sandra Torres', 13.4833, -88.1833, true, 'Lunes a Domingo: 6:00 AM - 9:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Plaza Chaparrastique', 'Centro Comercial Plaza Chaparrastique', 'San Miguel', 'San Miguel', '+503 2661-1010', 'Fernando García', 13.4756, -88.1723, true, 'Lunes a Domingo: 8:00 AM - 9:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Continuando con más sucursales distribuidas por El Salvador...
-- (Para mantener el ejemplo conciso, agregamos algunas más representativas)

-- Sonsonate
INSERT INTO branches (branch_number, name, address, city, department, phone, manager_name, latitude, longitude, active, opening_hours, created_at, updated_at) VALUES 
(11, 'Centro Sonsonate', 'Av. Morazán #45', 'Sonsonate', 'Sonsonate', '+503 2451-1011', 'Ricardo Flores', 13.7189, -89.7244, true, 'Lunes a Domingo: 6:00 AM - 9:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- La Libertad
INSERT INTO branches (branch_number, name, address, city, department, phone, manager_name, latitude, longitude, active, opening_hours, created_at, updated_at) VALUES 
(12, 'Santa Tecla Centro', 'Av. Los Próceres', 'Santa Tecla', 'La Libertad', '+503 2229-1012', 'Mónica López', 13.6756, -89.2823, true, 'Lunes a Domingo: 6:30 AM - 10:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'La Libertad Puerto', 'Puerto de La Libertad', 'La Libertad', 'La Libertad', '+503 2335-1013', 'David Herrera', 13.4886, -89.3222, true, 'Lunes a Domingo: 6:00 AM - 8:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Agregando más sucursales manualmente (simulando las 118)
-- Para demostración, agregamos algunas más importantes
INSERT INTO branches (branch_number, name, address, city, department, phone, manager_name, latitude, longitude, active, opening_hours, created_at, updated_at) VALUES 
(14, 'Sucursal Apopa', 'Centro Apopa', 'Apopa', 'San Salvador', '+503 2000-1014', 'Carlos Mendoza', 13.8167, -89.1833, true, 'Lunes a Domingo: 6:00 AM - 9:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Sucursal Mejicanos', 'Av. Principal Mejicanos', 'Mejicanos', 'San Salvador', '+503 2000-1015', 'Ana Rodríguez', 13.7400, -89.2075, true, 'Lunes a Domingo: 6:30 AM - 9:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 'Sucursal Ilopango', 'Centro Ilopango', 'Ilopango', 'San Salvador', '+503 2000-1016', 'Luis Pérez', 13.7019, -89.1094, true, 'Lunes a Domingo: 6:00 AM - 9:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 'Sucursal Delgado', 'Ciudad Delgado Centro', 'Ciudad Delgado', 'San Salvador', '+503 2000-1017', 'María Castillo', 13.7325, -89.1681, true, 'Lunes a Domingo: 6:00 AM - 9:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 'Sucursal Cojutepeque', 'Parque Central Cojutepeque', 'Cojutepeque', 'Cuscatlán', '+503 2000-1018', 'Roberto Flores', 13.7167, -88.9333, true, 'Lunes a Domingo: 6:00 AM - 8:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 'Sucursal Zacatecoluca', 'Av. Gerardo Barrios', 'Zacatecoluca', 'La Paz', '+503 2000-1019', 'Elena Vásquez', 13.5044, -88.8653, true, 'Lunes a Domingo: 6:00 AM - 8:30 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, 'Sucursal Chalatenango', 'Centro Chalatenango', 'Chalatenango', 'Chalatenango', '+503 2000-1020', 'José Martínez', 14.0333, -88.9333, true, 'Lunes a Domingo: 6:00 AM - 8:00 PM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUCTOS DE EJEMPLO
-- =====================================================

-- Productos Alimentos
INSERT INTO products (code, name, category, price, image_url, distributor_id, expiration_date, profit_margin, active, created_at, updated_at) VALUES 
('ALI001', 'Arroz Selecto Premium 1lb', 'ALIMENTOS', 1.20, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop', 1, '2025-12-31', 25.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALI002', 'Frijoles Rojos La Costeña', 'ALIMENTOS', 0.89, 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=200&h=200&fit=crop', 2, '2026-06-15', 30.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALI003', 'Aceite Vegetal Cristal 16oz', 'ALIMENTOS', 2.15, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop', 1, '2025-08-20', 20.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALI004', 'Pasta Espagueti Don Pollo', 'ALIMENTOS', 0.75, 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=200&h=200&fit=crop', 2, '2026-03-10', 35.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ALI005', 'Azúcar Blanca Central Izalco 2lb', 'ALIMENTOS', 1.45, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=200&h=200&fit=crop', 1, '2027-01-15', 18.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Productos Bebidas
INSERT INTO products (code, name, category, price, image_url, distributor_id, expiration_date, profit_margin, active, created_at, updated_at) VALUES 
('BEB001', 'Coca Cola 355ml', 'BEBIDAS', 0.75, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop', 3, '2025-09-30', 40.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BEB002', 'Pepsi 600ml', 'BEBIDAS', 1.00, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop', 3, '2025-10-15', 38.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BEB003', 'Agua Cristal 500ml', 'BEBIDAS', 0.35, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop', 3, '2026-12-31', 50.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BEB004', 'Jugo Del Valle Naranja 1L', 'BEBIDAS', 1.85, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop', 3, '2025-07-20', 32.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Productos Carnes
INSERT INTO products (code, name, category, price, image_url, distributor_id, expiration_date, profit_margin, active, created_at, updated_at) VALUES 
('CAR001', 'Pollo Entero Fresco', 'CARNES', 4.50, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop', 4, '2024-11-05', 28.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAR002', 'Carne Molida de Res 1lb', 'CARNES', 3.25, 'https://images.unsplash.com/photo-1588347818131-d2d4b4187b1a?w=200&h=200&fit=crop', 4, '2024-11-03', 25.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CAR003', 'Jamón de Pavo Rebanado', 'CARNES', 2.80, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop', 4, '2024-11-10', 35.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Productos Frutas
INSERT INTO products (code, name, category, price, image_url, distributor_id, expiration_date, profit_margin, active, created_at, updated_at) VALUES 
('FRU001', 'Manzanas Rojas 1lb', 'FRUTAS', 2.25, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop', 5, '2024-11-15', 45.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FRU002', 'Bananos Maduros 1lb', 'FRUTAS', 0.85, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop', 5, '2024-11-08', 55.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FRU003', 'Naranjas Dulces 1lb', 'FRUTAS', 1.50, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200&fit=crop', 5, '2024-11-12', 50.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Productos Limpieza
INSERT INTO products (code, name, category, price, image_url, distributor_id, expiration_date, profit_margin, active, created_at, updated_at) VALUES 
('LIM001', 'Detergente Ariel Polvo 1kg', 'LIMPIEZA', 3.80, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop', 6, '2027-05-30', 22.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('LIM002', 'Jabón Dove Original', 'LIMPIEZA', 1.25, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop', 6, '2026-08-15', 40.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Productos Juguetes
INSERT INTO products (code, name, category, price, image_url, distributor_id, expiration_date, profit_margin, active, created_at, updated_at) VALUES 
('JUG001', 'Hot Wheels Carro Deportivo', 'JUGUETES', 1.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', 1, '2030-12-31', 60.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JUG002', 'Muñeca Barbie Clásica', 'JUGUETES', 12.99, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop', 1, '2030-12-31', 45.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- STOCK POR SUCURSALES (Ejemplos para algunos productos)
-- =====================================================

-- Stock para Arroz Selecto Premium (producto ID 1)
INSERT INTO product_branch_stock (product_id, branch_number, stock_quantity) VALUES 
(1, 1, 45), (1, 2, 32), (1, 3, 28), (1, 4, 50), (1, 5, 38),
(1, 6, 25), (1, 7, 41), (1, 8, 33), (1, 9, 29), (1, 10, 47);

-- Stock para Coca Cola (producto ID 6)
INSERT INTO product_branch_stock (product_id, branch_number, stock_quantity) VALUES 
(6, 1, 120), (6, 2, 98), (6, 3, 87), (6, 4, 134), (6, 5, 102),
(6, 6, 76), (6, 7, 91), (6, 8, 85), (6, 9, 108), (6, 10, 95);

-- Stock para productos adicionales (distribución aleatoria)
-- Esto simularía el stock en múltiples sucursales para cada producto

-- =====================================================
-- DATOS ADICIONALES DE CONFIGURACIÓN
-- =====================================================

-- Estas serían variables de configuración del sistema si se implementan en el futuro
-- INSERT INTO system_config (config_key, config_value, description) VALUES 
-- ('TOTAL_BRANCHES', '118', 'Número total de sucursales activas'),
-- ('DEFAULT_PROFIT_MARGIN', '25.0', 'Margen de ganancia por defecto para nuevos productos'),
-- ('LOW_STOCK_THRESHOLD', '5', 'Umbral para considerar stock bajo'),
-- ('NEAR_EXPIRATION_DAYS', '30', 'Días para considerar producto próximo a vencer');

COMMIT;