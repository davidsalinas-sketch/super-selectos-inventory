package com.superselectos.inventory.service;

import com.superselectos.inventory.entity.User;
import com.superselectos.inventory.entity.User.UserRole;
import com.superselectos.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio para la gestión de usuarios
 * 
 * @author David
 * @version 2.5.1
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Crear un nuevo usuario
     */
    public User createUser(User user) {
        log.info("👤 Creando nuevo usuario: {}", user.getUsername());
        
        // Validar username único
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Ya existe un usuario con username: " + user.getUsername());
        }

        // Validar email único
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con email: " + user.getEmail());
        }

        // Encriptar contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("✅ Usuario creado exitosamente: {} (ID: {})", savedUser.getUsername(), savedUser.getId());
        
        return savedUser;
    }

    /**
     * Actualizar usuario existente
     */
    public User updateUser(Long id, User userUpdate) {
        log.info("🔄 Actualizando usuario ID: {}", id);
        
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Validar username único si ha cambiado
        if (!existingUser.getUsername().equals(userUpdate.getUsername()) && 
            userRepository.existsByUsernameAndIdNot(userUpdate.getUsername(), id)) {
            throw new IllegalArgumentException("Ya existe un usuario con username: " + userUpdate.getUsername());
        }

        // Validar email único si ha cambiado
        if (!existingUser.getEmail().equals(userUpdate.getEmail()) && 
            userRepository.existsByEmailAndIdNot(userUpdate.getEmail(), id)) {
            throw new IllegalArgumentException("Ya existe un usuario con email: " + userUpdate.getEmail());
        }

        // Actualizar campos
        existingUser.setUsername(userUpdate.getUsername());
        existingUser.setFullName(userUpdate.getFullName());
        existingUser.setEmail(userUpdate.getEmail());
        existingUser.setRole(userUpdate.getRole());
        existingUser.setActive(userUpdate.getActive());

        // Solo actualizar contraseña si se proporciona una nueva
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
        }

        User savedUser = userRepository.save(existingUser);
        log.info("✅ Usuario actualizado exitosamente: {}", savedUser.getUsername());
        
        return savedUser;
    }

    /**
     * Cambiar contraseña de usuario
     */
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        log.info("🔐 Cambiando contraseña para usuario ID: {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Contraseña actual incorrecta");
        }

        // Actualizar contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("✅ Contraseña actualizada exitosamente para usuario: {}", user.getUsername());
    }

    /**
     * Desactivar usuario (soft delete)
     */
    public void deactivateUser(Long id) {
        log.info("❌ Desactivando usuario ID: {}", id);
        
        // Verificar que no sea el último administrador
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (user.getRole() == UserRole.ADMIN) {
            long activeAdmins = userRepository.findActiveAdministrators().size();
            if (activeAdmins <= 1) {
                throw new IllegalArgumentException("No se puede desactivar el último administrador del sistema");
            }
        }

        user.setActive(false);
        userRepository.save(user);
        
        log.info("✅ Usuario desactivado exitosamente: {}", user.getUsername());
    }

    /**
     * Activar usuario
     */
    public void activateUser(Long id) {
        log.info("✅ Activando usuario ID: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        user.setActive(true);
        userRepository.save(user);
        
        log.info("✅ Usuario activado exitosamente: {}", user.getUsername());
    }

    /**
     * Obtener usuario por ID
     */
    @Transactional(readOnly = true)
    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Obtener usuario por username
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Obtener usuario por email
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Listar todos los usuarios activos
     */
    @Transactional(readOnly = true)
    public List<User> getAllActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    /**
     * Búsqueda con paginación y filtros
     */
    @Transactional(readOnly = true)
    public Page<User> searchUsers(String search, UserRole role, Pageable pageable) {
        return userRepository.findWithFilters(search, role, pageable);
    }

    /**
     * Obtener usuarios por rol
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRoleAndActiveTrue(role);
    }

    /**
     * Obtener estadísticas de usuarios
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics() {
        log.debug("📊 Calculando estadísticas de usuarios...");
        
        Map<String, Object> stats = new HashMap<>();
        
        // Total de usuarios activos
        long totalActiveUsers = userRepository.countActiveUsers();
        
        // Usuarios por rol
        List<Object[]> usersByRole = userRepository.getUserCountByRole();
        Map<String, Long> roleStats = new HashMap<>();
        
        for (Object[] result : usersByRole) {
            UserRole role = (UserRole) result[0];
            Long count = (Long) result[1];
            roleStats.put(role.getDisplayName(), count);
        }
        
        // Usuarios recientes (últimos 30 días)
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<User> inactiveUsers = userRepository.findInactiveUsersSince(cutoffDate);
        
        stats.put("totalActiveUsers", totalActiveUsers);
        stats.put("usersByRole", roleStats);
        stats.put("inactiveUsersCount", inactiveUsers.size());
        
        log.debug("✅ Estadísticas calculadas: {} usuarios activos", totalActiveUsers);
        
        return stats;
    }

    /**
     * Verificar si el username está disponible
     */
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username, Long excludeId) {
        if (excludeId != null) {
            return !userRepository.existsByUsernameAndIdNot(username, excludeId);
        }
        return !userRepository.existsByUsername(username);
    }

    /**
     * Verificar si el email está disponible
     */
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email, Long excludeId) {
        if (excludeId != null) {
            return !userRepository.existsByEmailAndIdNot(email, excludeId);
        }
        return !userRepository.existsByEmail(email);
    }

    /**
     * Obtener usuarios administradores activos
     */
    @Transactional(readOnly = true)
    public List<User> getActiveAdministrators() {
        return userRepository.findActiveAdministrators();
    }

    /**
     * Verificar si existe al menos un administrador activo
     */
    @Transactional(readOnly = true)
    public boolean hasActiveAdministrator() {
        return userRepository.existsActiveAdministrator();
    }
}