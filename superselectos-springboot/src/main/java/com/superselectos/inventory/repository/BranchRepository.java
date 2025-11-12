package com.superselectos.inventory.repository;

import com.superselectos.inventory.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Branch
 * 
 * @author David
 * @version 2.5.1
 */
@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    // Búsquedas básicas
    Optional<Branch> findByBranchNumber(Integer branchNumber);
    
    List<Branch> findByActiveTrue();
    
    Page<Branch> findByActiveTrue(Pageable pageable);

    // Búsquedas por ubicación
    List<Branch> findByActiveTrueAndDepartment(String department);
    
    List<Branch> findByActiveTrueAndCity(String city);
    
    List<Branch> findByActiveTrueAndDepartmentAndCity(String department, String city);

    // Búsquedas de texto
    @Query("SELECT b FROM Branch b WHERE b.active = true AND " +
           "(LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.city) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.address) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "CAST(b.branchNumber AS string) LIKE CONCAT('%', :search, '%'))")
    Page<Branch> findBySearchTerm(@Param("search") String searchTerm, Pageable pageable);

    // Sucursales ordenadas por número
    @Query("SELECT b FROM Branch b WHERE b.active = true ORDER BY b.branchNumber ASC")
    List<Branch> findAllActiveOrderByBranchNumber();

    // Estadísticas
    @Query("SELECT COUNT(b) FROM Branch b WHERE b.active = true")
    long countActiveBranches();

    @Query("SELECT b.department, COUNT(b) FROM Branch b WHERE b.active = true GROUP BY b.department ORDER BY b.department")
    List<Object[]> getBranchCountByDepartment();

    @Query("SELECT b.city, COUNT(b) FROM Branch b WHERE b.active = true GROUP BY b.city ORDER BY b.city")
    List<Object[]> getBranchCountByCity();

    // Sucursales con coordenadas
    @Query("SELECT b FROM Branch b WHERE b.active = true AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL")
    List<Branch> findBranchesWithCoordinates();

    @Query("SELECT b FROM Branch b WHERE b.active = true AND (b.latitude IS NULL OR b.longitude IS NULL)")
    List<Branch> findBranchesWithoutCoordinates();

    // Validaciones
    boolean existsByBranchNumber(Integer branchNumber);
    
    boolean existsByBranchNumberAndIdNot(Integer branchNumber, Long id);

    // Búsquedas por rango de números
    @Query("SELECT b FROM Branch b WHERE b.active = true AND b.branchNumber BETWEEN :start AND :end ORDER BY b.branchNumber")
    List<Branch> findByBranchNumberRange(@Param("start") Integer start, @Param("end") Integer end);

    // Sucursales por departamento específico (útil para El Salvador)
    @Query("SELECT DISTINCT b.department FROM Branch b WHERE b.active = true ORDER BY b.department")
    List<String> findAllDepartments();

    @Query("SELECT DISTINCT b.city FROM Branch b WHERE b.active = true AND b.department = :department ORDER BY b.city")
    List<String> findCitiesByDepartment(@Param("department") String department);

    // Búsqueda compleja con múltiples filtros
    @Query("SELECT b FROM Branch b WHERE b.active = true " +
           "AND (:search IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(b.city) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(b.address) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:department IS NULL OR LOWER(b.department) = LOWER(:department)) " +
           "AND (:city IS NULL OR LOWER(b.city) = LOWER(:city)) " +
           "AND (:branchNumber IS NULL OR b.branchNumber = :branchNumber)")
    Page<Branch> findWithFilters(@Param("search") String search,
                                @Param("department") String department,
                                @Param("city") String city,
                                @Param("branchNumber") Integer branchNumber,
                                Pageable pageable);

    // Sucursales más cercanas (requiere coordenadas)
    @Query("SELECT b FROM Branch b WHERE b.active = true AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL " +
           "ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(b.latitude)) * cos(radians(b.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(b.latitude))))")
    List<Branch> findNearestBranches(@Param("lat") Double latitude, @Param("lng") Double longitude, Pageable pageable);

    // Reportes específicos
    @Query("SELECT b.department, b.city, COUNT(b) FROM Branch b WHERE b.active = true GROUP BY b.department, b.city ORDER BY b.department, b.city")
    List<Object[]> getBranchReportByLocation();

    // Sucursales recientes
    @Query("SELECT b FROM Branch b WHERE b.active = true ORDER BY b.createdAt DESC")
    List<Branch> findRecentBranches(Pageable pageable);
}