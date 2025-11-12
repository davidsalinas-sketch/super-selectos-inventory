package com.superselectos.inventory.config;

import com.superselectos.inventory.entity.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Manejador personalizado para redirigir después del login según el rol
 * 
 * @author David
 * @version 2.5.1
 */
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        
        User user = (User) authentication.getPrincipal();
        
        // Log del login exitoso
        System.out.println("✅ Login exitoso: " + user.getUsername() + " (" + user.getRole().getDisplayName() + ")");
        
        // Redirigir según el rol
        String targetUrl = switch (user.getRole()) {
            case ADMIN -> "/dashboard?section=inventory&welcome=admin";
            case MANAGER -> "/dashboard?section=inventory&welcome=manager";
            case EMPLOYEE -> "/dashboard?section=inventory&welcome=employee";
            default -> "/dashboard";
        };
        
        response.sendRedirect(targetUrl);
    }
}