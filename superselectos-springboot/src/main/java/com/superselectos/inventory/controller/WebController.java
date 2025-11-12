package com.superselectos.inventory.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controlador principal para las vistas web
 * 
 * @author David
 * @version 3.0.0
 */
@Controller
public class WebController {

    /**
     * Página principal - redirige al dashboard si está autenticado
     */
    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    /**
     * Página de login
     */
    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                       @RequestParam(value = "logout", required = false) String logout,
                       Model model) {
        if (error != null) {
            model.addAttribute("errorMessage", "Usuario o contraseña incorrectos");
        }
        
        if (logout != null) {
            model.addAttribute("logoutMessage", "Has cerrado sesión exitosamente");
        }
        
        return "login";
    }

    /**
     * Dashboard principal después del login
     */
    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(value = "section", defaultValue = "overview") String section,
                          @RequestParam(value = "welcome", required = false) String welcome,
                          Model model, Authentication authentication) {
        
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        
        model.addAttribute("activeSection", section);
        
        if (welcome != null) {
            String welcomeMessage = switch (welcome) {
                case "admin" -> "¡Bienvenido Administrador! Tienes acceso completo al sistema.";
                case "manager" -> "¡Bienvenido Gerente! Puedes gestionar inventarios y generar reportes.";
                case "employee" -> "¡Bienvenido Empleado! Puedes consultar y actualizar inventarios.";
                default -> "¡Bienvenido al Sistema de Inventario Super Selectos!";
            };
            model.addAttribute("welcomeMessage", welcomeMessage);
        }
        
        return "dashboard";
    }

    /**
     * Página de gestión de productos
     */
    @GetMapping("/products")
    public String products(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "products";
    }

    /**
     * Página de usuarios (solo para administradores)
     */
    @GetMapping("/users")
    public String users(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "users";
    }

    /**
     * Página de distribuidores
     */
    @GetMapping("/distributors")
    public String distributors(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "distributors";
    }

    /**
     * Página de sucursales/mapa
     */
    @GetMapping("/branches")
    public String branches(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "branches";
    }

    /**
     * Página de reportes
     */
    @GetMapping("/reports")
    public String reports(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "reports";
    }

    /**
     * Página de perfil de usuario
     */
    @GetMapping("/profile")
    public String profile(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "profile";
    }

    /**
     * Página de configuración del sistema (solo para administradores)
     */
    @GetMapping("/settings")
    public String settings(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute("username", authentication.getName());
            model.addAttribute("authorities", authentication.getAuthorities());
        }
        return "settings";
    }

    /**
     * Página de inventario (compatibilidad con versión anterior)
     */
    @GetMapping("/inventory")
    public String inventory() {
        return "redirect:/products";
    }
}