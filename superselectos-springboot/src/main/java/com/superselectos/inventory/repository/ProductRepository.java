package com.superselectos.inventory.repository;

import com.superselectos.inventory.entity.Product;
import com.superselectos.inventory.entity.Product.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Product
 * 
 * @author David
 * @version 2.5.1
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Búsquedas básicas
    Optional<Product> findByCode(String code);
    
    List<Product> findByActiveTrue();
    
    List<Product> findByCategory(ProductCategory category);
    
    List<Product> findByDistributorId(Long distributorId);

    // Búsquedas avanzadas
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findBySearchTerm(@Param("search") String searchTerm, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category = :category")
    Page<Product> findActiveByCategoryWithPagination(@Param("category") ProductCategory category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.distributor.id = :distributorId")
    Page<Product> findActiveByDistributorWithPagination(@Param("distributorId") Long distributorId, Pageable pageable);

    // Productos próximos a vencer
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.expirationDate BETWEEN :startDate AND :endDate")
    List<Product> findProductsNearExpiration(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Productos con stock por sucursal
    @Query("SELECT p FROM Product p JOIN p.branchStock bs WHERE bs.key = :branchNumber AND bs.value > 0 AND p.active = true")
    List<Product> findProductsWithStockInBranch(@Param("branchNumber") Integer branchNumber);

    @Query("SELECT p FROM Product p JOIN p.branchStock bs WHERE bs.key = :branchNumber AND bs.value > 0 AND p.active = true AND p.category = :category")
    List<Product> findProductsWithStockInBranchByCategory(@Param("branchNumber") Integer branchNumber, @Param("category") ProductCategory category);

    // Estadísticas y agregaciones
    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true")
    long countActiveProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true AND p.category = :category")
    long countActiveProductsByCategory(@Param("category") ProductCategory category);

    @Query("SELECT SUM(bs.value) FROM Product p JOIN p.branchStock bs WHERE p.active = true")
    Long getTotalStockQuantity();

    @Query("SELECT SUM(bs.value * p.price) FROM Product p JOIN p.branchStock bs WHERE p.active = true")
    BigDecimal getTotalInventoryValue();

    // Productos sin stock
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(p.branchStock IS EMPTY OR " +
           "NOT EXISTS (SELECT bs FROM Product p2 JOIN p2.branchStock bs WHERE p2.id = p.id AND bs.value > 0))")
    List<Product> findProductsWithoutStock();

    // Productos con bajo stock (menos de 5 unidades totales)
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(SELECT COALESCE(SUM(bs.value), 0) FROM Product p2 JOIN p2.branchStock bs WHERE p2.id = p.id) < :threshold")
    List<Product> findProductsWithLowStock(@Param("threshold") int threshold);

    // Búsqueda compleja con múltiples filtros
    @Query("SELECT p FROM Product p WHERE p.active = true " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:distributorId IS NULL OR p.distributor.id = :distributorId) " +
           "AND (:branchNumber IS NULL OR EXISTS (SELECT bs FROM Product p2 JOIN p2.branchStock bs WHERE p2.id = p.id AND bs.key = :branchNumber AND bs.value > 0))")
    Page<Product> findWithFilters(@Param("search") String search, 
                                 @Param("category") ProductCategory category,
                                 @Param("distributorId") Long distributorId,
                                 @Param("branchNumber") Integer branchNumber,
                                 Pageable pageable);

    // Reportes específicos
    @Query("SELECT p.category, COUNT(p), SUM(bs.value) FROM Product p JOIN p.branchStock bs WHERE p.active = true GROUP BY p.category")
    List<Object[]> getInventoryReportByCategory();

    @Query("SELECT d.name, COUNT(p), SUM(bs.value) FROM Product p JOIN p.distributor d JOIN p.branchStock bs WHERE p.active = true GROUP BY d.id, d.name")
    List<Object[]> getInventoryReportByDistributor();

    // Validaciones
    boolean existsByCodeAndIdNot(String code, Long id);
    
    boolean existsByCode(String code);
}