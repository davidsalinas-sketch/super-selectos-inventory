package com.superselectos.inventory.config;

import com.superselectos.inventory.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Configuración de Spring Security para Super Selectos
 * 
 * @author David
 * @version 2.5.1
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userDetailsService);
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new CustomAuthenticationSuccessHandler();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin) // Para H2 Console
            )
            .authorizeHttpRequests(auth -> auth
                // Recursos públicos
                .requestMatchers(
                    "/css/**", "/js/**", "/images/**", "/webjars/**",
                    "/favicon.ico", "/error", "/h2-console/**"
                ).permitAll()
                
                // API público (documentación)
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Endpoints de salud
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                
                // Login y registro
                .requestMatchers("/", "/login", "/register").permitAll()
                
                // Dashboard - todos los usuarios autenticados
                .requestMatchers("/dashboard/**", "/inventory/**").authenticated()
                
                // Gestión de productos - ADMIN y MANAGER
                .requestMatchers("/api/products/create", "/api/products/update/**", "/api/products/delete/**")
                .hasAnyRole("ADMIN", "MANAGER")
                
                // Gestión de usuarios - solo ADMIN
                .requestMatchers("/users/**", "/api/users/**").hasRole("ADMIN")
                
                // Gestión de distribuidores - solo ADMIN
                .requestMatchers("/distributors/**", "/api/distributors/**").hasRole("ADMIN")
                
                // Reportes y exportación - ADMIN y MANAGER
                .requestMatchers("/reports/**", "/api/reports/**", "/export/**").hasAnyRole("ADMIN", "MANAGER")
                
                // API de lectura - todos los roles autenticados
                .requestMatchers("/api/products", "/api/products/**", "/api/branches/**").authenticated()
                
                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/perform_login")
                .successHandler(successHandler())
                .failureUrl("/login?error=true")
                .usernameParameter("username")
                .passwordParameter("password")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .sessionManagement(session -> session
                .sessionFixation(fixation -> fixation.migrateSession())
                .sessionConcurrency(concurrency -> concurrency
                    .maximumSessions(1)
                    .maxSessionsPreventsLogin(false)
                )
            )
            .authenticationProvider(authenticationProvider());

        return http.build();
    }
}