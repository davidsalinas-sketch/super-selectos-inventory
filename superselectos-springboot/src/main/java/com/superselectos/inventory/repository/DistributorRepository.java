package com.superselectos.inventory.repository;

import com.superselectos.inventory.entity.Distributor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Distributor
 * 
 * @author David
 * @version 2.5.1
 */
@Repository
public interface DistributorRepository extends JpaRepository<Distributor, Long> {

    // Búsquedas básicas
    Optional<Distributor> findByEmail(String email);
    
    List<Distributor> findByActiveTrue();
    
    Page<Distributor> findByActiveTrue(Pageable pageable);

    // Búsquedas por nombre
    List<Distributor> findByNameContainingIgnoreCase(String name);
    
    Optional<Distributor> findByNameIgnoreCase(String name);

    // Búsquedas avanzadas
    @Query("SELECT d FROM Distributor d WHERE d.active = true AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.contactPerson) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "d.phone LIKE CONCAT('%', :search, '%'))")
    Page<Distributor> findBySearchTerm(@Param("search") String searchTerm, Pageable pageable);

    // Distribuidores por ubicación
    List<Distributor> findByActiveTrueAndCity(String city);
    
    List<Distributor> findByActiveTrueAndCountry(String country);

    // Estadísticas
    @Query("SELECT COUNT(d) FROM Distributor d WHERE d.active = true")
    long countActiveDistributors();

    @Query("SELECT d.city, COUNT(d) FROM Distributor d WHERE d.active = true GROUP BY d.city")
    List<Object[]> getDistributorCountByCity();

    @Query("SELECT d.country, COUNT(d) FROM Distributor d WHERE d.active = true GROUP BY d.country")
    List<Object[]> getDistributorCountByCountry();

    // Distribuidores con productos
    @Query("SELECT d FROM Distributor d WHERE d.active = true AND SIZE(d.products) > 0")
    List<Distributor> findDistributorsWithProducts();

    @Query("SELECT d FROM Distributor d WHERE d.active = true AND SIZE(d.products) = 0")
    List<Distributor> findDistributorsWithoutProducts();

    // Distribuidores por cantidad de productos
    @Query("SELECT d FROM Distributor d WHERE d.active = true AND SIZE(d.products) >= :minProducts")
    List<Distributor> findDistributorsWithMinProducts(@Param("minProducts") int minProducts);

    // Validaciones
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndIdNot(String email, Long id);
    
    boolean existsByNameIgnoreCase(String name);
    
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    // Búsqueda compleja con múltiples filtros
    @Query("SELECT d FROM Distributor d WHERE d.active = true " +
           "AND (:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.contactPerson) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.email) LIKE LOWER(CONCAT('%', :search, '%')) OR d.phone LIKE CONCAT('%', :search, '%')) " +
           "AND (:city IS NULL OR LOWER(d.city) = LOWER(:city)) " +
           "AND (:country IS NULL OR LOWER(d.country) = LOWER(:country))")
    Page<Distributor> findWithFilters(@Param("search") String search,
                                     @Param("city") String city,
                                     @Param("country") String country,
                                     Pageable pageable);

    // Reportes específicos
    @Query("SELECT d.name, COUNT(p), " +
           "SUM(CASE WHEN p.active = true THEN 1 ELSE 0 END) as activeProducts " +
           "FROM Distributor d LEFT JOIN d.products p " +
           "WHERE d.active = true " +
           "GROUP BY d.id, d.name " +
           "ORDER BY COUNT(p) DESC")
    List<Object[]> getDistributorProductReport();

    // Distribuidores más recientes
    @Query("SELECT d FROM Distributor d WHERE d.active = true ORDER BY d.createdAt DESC")
    List<Distributor> findRecentDistributors(Pageable pageable);

    // Distribuidores actualizados recientemente
    @Query("SELECT d FROM Distributor d WHERE d.active = true ORDER BY d.updatedAt DESC")
    List<Distributor> findRecentlyUpdatedDistributors(Pageable pageable);
}