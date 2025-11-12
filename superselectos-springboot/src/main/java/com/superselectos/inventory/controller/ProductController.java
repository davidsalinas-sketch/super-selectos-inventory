package com.superselectos.inventory.controller;

import com.superselectos.inventory.entity.Product;
import com.superselectos.inventory.entity.Product.ProductCategory;
import com.superselectos.inventory.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * API REST para la gestión de productos
 * 
 * @author David
 * @version 2.5.1
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Productos", description = "API para la gestión de productos del inventario")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    /**
     * Listar todos los productos con paginación y filtros
     */
    @GetMapping
    @Operation(summary = "Listar productos", description = "Obtiene una lista paginada de productos con filtros opcionales")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de productos obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para acceder a este recurso")
    })
    public ResponseEntity<Page<Product>> getAllProducts(
            @Parameter(description = "Término de búsqueda") @RequestParam(required = false) String search,
            @Parameter(description = "Categoría del producto") @RequestParam(required = false) ProductCategory category,
            @Parameter(description = "ID del distribuidor") @RequestParam(required = false) Long distributorId,
            @Parameter(description = "Número de sucursal") @RequestParam(required = false) Integer branchNumber,
            @Parameter(description = "Página (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Campo de ordenamiento") @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Dirección de ordenamiento") @RequestParam(defaultValue = "asc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Product> products = productService.searchProducts(search, category, distributorId, branchNumber, pageable);
        
        log.debug("📦 Productos obtenidos: {} resultados en página {}", products.getTotalElements(), page);
        
        return ResponseEntity.ok(products);
    }

    /**
     * Obtener un producto por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto", description = "Obtiene un producto específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto encontrado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productService.getProduct(id)
                .map(product -> {
                    log.debug("📦 Producto encontrado: {}", product.getCode());
                    return ResponseEntity.ok(product);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener producto por código
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Obtener producto por código", description = "Obtiene un producto por su código único")
    public ResponseEntity<Product> getProductByCode(@PathVariable String code) {
        return productService.getProductByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear un nuevo producto
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Crear producto", description = "Crea un nuevo producto en el inventario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Producto creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "409", description = "El código del producto ya existe"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para crear productos")
    })
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            log.info("✅ Producto creado via API: {}", createdProduct.getCode());
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            log.warn("❌ Error creando producto: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar un producto existente
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para actualizar productos")
    })
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            log.info("🔄 Producto actualizado via API: {}", updatedProduct.getCode());
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            log.warn("❌ Error actualizando producto {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar un producto
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto del inventario (soft delete)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Producto eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar productos")
    })
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            log.info("🗑️ Producto eliminado via API: ID {}", id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("❌ Error eliminando producto {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar stock de un producto en una sucursal
     */
    @PutMapping("/{id}/stock/{branchNumber}")
    @Operation(summary = "Actualizar stock", description = "Actualiza el stock de un producto en una sucursal específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<Product> updateBranchStock(@PathVariable Long id, 
                                                   @PathVariable Integer branchNumber, 
                                                   @RequestParam Integer quantity) {
        try {
            Product updatedProduct = productService.updateBranchStock(id, branchNumber, quantity);
            log.info("📊 Stock actualizado via API - Producto: {}, Sucursal: {}, Cantidad: {}", 
                    id, branchNumber, quantity);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            log.warn("❌ Error actualizando stock: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener productos por categoría
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Productos por categoría", description = "Obtiene todos los productos de una categoría específica")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable ProductCategory category) {
        List<Product> products = productService.getProductsByCategory(category);
        log.debug("📦 Productos por categoría {}: {} resultados", category, products.size());
        return ResponseEntity.ok(products);
    }

    /**
     * Obtener productos próximos a vencer
     */
    @GetMapping("/near-expiration")
    @Operation(summary = "Productos próximos a vencer", description = "Obtiene productos que vencen en los próximos días especificados")
    public ResponseEntity<List<Product>> getProductsNearExpiration(
            @Parameter(description = "Días de umbral") @RequestParam(defaultValue = "30") int days) {
        List<Product> products = productService.getProductsNearExpiration(days);
        log.debug("⚠️ Productos próximos a vencer ({} días): {} resultados", days, products.size());
        return ResponseEntity.ok(products);
    }

    /**
     * Obtener productos con stock en una sucursal
     */
    @GetMapping("/branch/{branchNumber}")
    @Operation(summary = "Productos por sucursal", description = "Obtiene productos con stock en una sucursal específica")
    public ResponseEntity<List<Product>> getProductsInBranch(@PathVariable Integer branchNumber) {
        List<Product> products = productService.getProductsWithStockInBranch(branchNumber);
        log.debug("🏢 Productos en sucursal {}: {} resultados", branchNumber, products.size());
        return ResponseEntity.ok(products);
    }

    /**
     * Obtener métricas generales del inventario
     */
    @GetMapping("/metrics")
    @Operation(summary = "Métricas del inventario", description = "Obtiene métricas generales del inventario")
    public ResponseEntity<Map<String, Object>> getInventoryMetrics() {
        Map<String, Object> metrics = productService.getInventoryMetrics();
        log.debug("📈 Métricas del inventario calculadas");
        return ResponseEntity.ok(metrics);
    }

    /**
     * Obtener métricas de una sucursal específica
     */
    @GetMapping("/metrics/branch/{branchNumber}")
    @Operation(summary = "Métricas por sucursal", description = "Obtiene métricas de inventario para una sucursal específica")
    public ResponseEntity<Map<String, Object>> getBranchMetrics(@PathVariable Integer branchNumber) {
        Map<String, Object> metrics = productService.getBranchMetrics(branchNumber);
        log.debug("📊 Métricas de sucursal {} calculadas", branchNumber);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Validar disponibilidad de código de producto
     */
    @GetMapping("/validate-code")
    @Operation(summary = "Validar código", description = "Verifica si un código de producto está disponible")
    public ResponseEntity<Map<String, Boolean>> validateProductCode(
            @RequestParam String code,
            @RequestParam(required = false) Long excludeId) {
        boolean available = productService.isCodeAvailable(code, excludeId);
        return ResponseEntity.ok(Map.of("available", available));
    }

    /**
     * Obtener todas las categorías disponibles
     */
    @GetMapping("/categories")
    @Operation(summary = "Listar categorías", description = "Obtiene todas las categorías de productos disponibles")
    public ResponseEntity<ProductCategory[]> getCategories() {
        return ResponseEntity.ok(ProductCategory.values());
    }
}