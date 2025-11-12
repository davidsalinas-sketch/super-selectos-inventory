package com.superselectos.inventory.repository;

import com.superselectos.inventory.entity.User;
import com.superselectos.inventory.entity.User.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad User
 * 
 * @author David
 * @version 2.5.1
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Búsquedas básicas para autenticación
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);

    // Usuarios activos
    List<User> findByActiveTrue();
    
    Page<User> findByActiveTrue(Pageable pageable);

    // Búsquedas por rol
    List<User> findByRole(UserRole role);
    
    List<User> findByRoleAndActiveTrue(UserRole role);

    // Búsquedas con filtros
    @Query("SELECT u FROM User u WHERE u.active = true AND " +
           "(LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findBySearchTerm(@Param("search") String searchTerm, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = :role")
    Page<User> findActiveByRoleWithPagination(@Param("role") UserRole role, Pageable pageable);

    // Estadísticas
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countActiveUsers();

    @Query("SELECT u.role, COUNT(u) FROM User u WHERE u.active = true GROUP BY u.role")
    List<Object[]> getUserCountByRole();

    // Validaciones
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsernameAndIdNot(String username, Long id);
    
    boolean existsByEmailAndIdNot(String email, Long id);

    // Usuarios recientes
    @Query("SELECT u FROM User u WHERE u.active = true ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(Pageable pageable);

    // Usuarios con último login
    @Query("SELECT u FROM User u WHERE u.active = true AND u.lastLogin IS NOT NULL ORDER BY u.lastLogin DESC")
    List<User> findUsersWithRecentLogin(Pageable pageable);

    // Usuarios inactivos por tiempo
    @Query("SELECT u FROM User u WHERE u.active = true AND " +
           "(u.lastLogin IS NULL OR u.lastLogin < :cutoffDate)")
    List<User> findInactiveUsersSince(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Actualizar último login
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);

    // Búsqueda compleja con múltiples filtros
    @Query("SELECT u FROM User u WHERE u.active = true " +
           "AND (:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:role IS NULL OR u.role = :role)")
    Page<User> findWithFilters(@Param("search") String search, 
                              @Param("role") UserRole role,
                              Pageable pageable);

    // Usuarios administradores
    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = 'ADMIN'")
    List<User> findActiveAdministrators();

    // Verificar si existe al menos un administrador activo
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.active = true AND u.role = 'ADMIN'")
    boolean existsActiveAdministrator();

    // Usuarios por departamento o área (si se implementa en el futuro)
    @Query("SELECT u FROM User u WHERE u.active = true AND " +
           "(:roleList IS NULL OR u.role IN :roleList)")
    List<User> findByRoleIn(@Param("roleList") List<UserRole> roles);
}