package com.superselectos.inventory.service;

import com.superselectos.inventory.entity.User;
import com.superselectos.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Implementación personalizada de UserDetailsService para Spring Security
 * 
 * @author David
 * @version 2.5.1
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("🔍 Buscando usuario: {}", username);
        
        User user = userRepository.findByUsernameOrEmail(username, username)
            .orElseThrow(() -> {
                log.warn("❌ Usuario no encontrado: {}", username);
                return new UsernameNotFoundException("Usuario no encontrado: " + username);
            });

        if (!user.getActive()) {
            log.warn("❌ Usuario inactivo: {}", username);
            throw new UsernameNotFoundException("Usuario inactivo: " + username);
        }

        log.debug("✅ Usuario encontrado: {} ({})", user.getUsername(), user.getRole().getDisplayName());
        
        // Actualizar último login de forma asíncrona
        updateLastLoginAsync(user.getId());
        
        return user;
    }

    @Transactional
    public void updateLastLoginAsync(Long userId) {
        try {
            userRepository.updateLastLogin(userId, LocalDateTime.now());
            log.debug("📅 Último login actualizado para usuario ID: {}", userId);
        } catch (Exception e) {
            log.error("❌ Error actualizando último login para usuario ID {}: {}", userId, e.getMessage());
        }
    }
}