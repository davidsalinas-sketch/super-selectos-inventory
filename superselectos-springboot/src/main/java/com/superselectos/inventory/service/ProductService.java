package com.superselectos.inventory.service;

import com.superselectos.inventory.entity.Product;
import com.superselectos.inventory.entity.Product.ProductCategory;
import com.superselectos.inventory.repository.DistributorRepository;
import com.superselectos.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio para la gestión de productos
 * 
 * @author David
 * @version 2.5.1
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final DistributorRepository distributorRepository;

    /**
     * Crear un nuevo producto
     */
    public Product createProduct(Product product) {
        log.info("📦 Creando nuevo producto: {}", product.getCode());
        
        // Validar código único
        if (productRepository.existsByCode(product.getCode())) {
            throw new IllegalArgumentException("Ya existe un producto con código: " + product.getCode());
        }

        // Validar distribuidor si está presente
        if (product.getDistributor() != null && product.getDistributor().getId() != null) {
            product.setDistributor(distributorRepository.findById(product.getDistributor().getId())
                .orElseThrow(() -> new IllegalArgumentException("Distribuidor no encontrado")));
        }

        // Inicializar stock si no existe
        if (product.getBranchStock() == null) {
            product.setBranchStock(new HashMap<>());
        }

        Product savedProduct = productRepository.save(product);
        log.info("✅ Producto creado exitosamente: {} (ID: {})", savedProduct.getCode(), savedProduct.getId());
        
        return savedProduct;
    }

    /**
     * Actualizar producto existente
     */
    public Product updateProduct(Long id, Product productUpdate) {
        log.info("🔄 Actualizando producto ID: {}", id);
        
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        // Validar código único si ha cambiado
        if (!existingProduct.getCode().equals(productUpdate.getCode()) && 
            productRepository.existsByCodeAndIdNot(productUpdate.getCode(), id)) {
            throw new IllegalArgumentException("Ya existe un producto con código: " + productUpdate.getCode());
        }

        // Actualizar campos
        existingProduct.setCode(productUpdate.getCode());
        existingProduct.setName(productUpdate.getName());
        existingProduct.setCategory(productUpdate.getCategory());
        existingProduct.setPrice(productUpdate.getPrice());
        existingProduct.setImageUrl(productUpdate.getImageUrl());
        existingProduct.setExpirationDate(productUpdate.getExpirationDate());
        existingProduct.setProfitMargin(productUpdate.getProfitMargin());
        existingProduct.setBranchStock(productUpdate.getBranchStock());

        // Actualizar distribuidor si está presente
        if (productUpdate.getDistributor() != null && productUpdate.getDistributor().getId() != null) {
            existingProduct.setDistributor(distributorRepository.findById(productUpdate.getDistributor().getId())
                .orElseThrow(() -> new IllegalArgumentException("Distribuidor no encontrado")));
        }

        Product savedProduct = productRepository.save(existingProduct);
        log.info("✅ Producto actualizado exitosamente: {}", savedProduct.getCode());
        
        return savedProduct;
    }

    /**
     * Eliminar producto (soft delete)
     */
    public void deleteProduct(Long id) {
        log.info("🗑️ Eliminando producto ID: {}", id);
        
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        product.setActive(false);
        productRepository.save(product);
        
        log.info("✅ Producto eliminado exitosamente: {}", product.getCode());
    }

    /**
     * Obtener producto por ID
     */
    @Transactional(readOnly = true)
    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    /**
     * Obtener producto por código
     */
    @Transactional(readOnly = true)
    public Optional<Product> getProductByCode(String code) {
        return productRepository.findByCode(code);
    }

    /**
     * Listar todos los productos activos
     */
    @Transactional(readOnly = true)
    public List<Product> getAllActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    /**
     * Búsqueda con paginación y filtros
     */
    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String search, ProductCategory category, 
                                       Long distributorId, Integer branchNumber, 
                                       Pageable pageable) {
        return productRepository.findWithFilters(search, category, distributorId, branchNumber, pageable);
    }

    /**
     * Obtener productos por categoría
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    /**
     * Obtener productos próximos a vencer
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsNearExpiration(int daysThreshold) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(daysThreshold);
        return productRepository.findProductsNearExpiration(startDate, endDate);
    }

    /**
     * Obtener productos con stock en una sucursal específica
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsWithStockInBranch(Integer branchNumber) {
        return productRepository.findProductsWithStockInBranch(branchNumber);
    }

    /**
     * Actualizar stock de un producto en una sucursal
     */
    public Product updateBranchStock(Long productId, Integer branchNumber, Integer quantity) {
        log.info("📊 Actualizando stock - Producto: {}, Sucursal: {}, Cantidad: {}", 
                productId, branchNumber, quantity);
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        if (product.getBranchStock() == null) {
            product.setBranchStock(new HashMap<>());
        }

        product.getBranchStock().put(branchNumber, Math.max(0, quantity));
        
        Product savedProduct = productRepository.save(product);
        log.info("✅ Stock actualizado exitosamente");
        
        return savedProduct;
    }

    /**
     * Obtener métricas del inventario
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getInventoryMetrics() {
        log.debug("📈 Calculando métricas del inventario...");
        
        Map<String, Object> metrics = new HashMap<>();
        
        // Contar productos activos
        long totalProducts = productRepository.countActiveProducts();
        
        // Stock total
        Long totalStock = productRepository.getTotalStockQuantity();
        if (totalStock == null) totalStock = 0L;
        
        // Valor total del inventario
        BigDecimal totalValue = productRepository.getTotalInventoryValue();
        if (totalValue == null) totalValue = BigDecimal.ZERO;
        
        // Productos con bajo stock
        List<Product> lowStockProducts = productRepository.findProductsWithLowStock(5);
        
        // Productos próximos a vencer (30 días)
        List<Product> nearExpirationProducts = getProductsNearExpiration(30);
        
        metrics.put("totalProducts", totalProducts);
        metrics.put("totalStock", totalStock);
        metrics.put("totalValue", totalValue);
        metrics.put("lowStockCount", lowStockProducts.size());
        metrics.put("nearExpirationCount", nearExpirationProducts.size());
        
        log.debug("✅ Métricas calculadas: {} productos, {} stock total, ${} valor total", 
                 totalProducts, totalStock, totalValue);
        
        return metrics;
    }

    /**
     * Obtener métricas por sucursal específica
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getBranchMetrics(Integer branchNumber) {
        log.debug("📊 Calculando métricas para sucursal: {}", branchNumber);
        
        List<Product> branchProducts = getProductsWithStockInBranch(branchNumber);
        
        Map<String, Object> metrics = new HashMap<>();
        
        int totalStock = branchProducts.stream()
            .mapToInt(p -> p.getBranchStock().getOrDefault(branchNumber, 0))
            .sum();
        
        BigDecimal totalValue = branchProducts.stream()
            .map(p -> p.getPrice().multiply(BigDecimal.valueOf(
                p.getBranchStock().getOrDefault(branchNumber, 0))))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        metrics.put("productsCount", branchProducts.size());
        metrics.put("totalStock", totalStock);
        metrics.put("totalValue", totalValue);
        
        log.debug("✅ Métricas de sucursal calculadas: {} productos, {} stock", 
                 branchProducts.size(), totalStock);
        
        return metrics;
    }

    /**
     * Validar disponibilidad de código de producto
     */
    @Transactional(readOnly = true)
    public boolean isCodeAvailable(String code, Long excludeId) {
        if (excludeId != null) {
            return !productRepository.existsByCodeAndIdNot(code, excludeId);
        }
        return !productRepository.existsByCode(code);
    }
}