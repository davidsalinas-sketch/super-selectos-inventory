package com.superselectos.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Aplicación principal del Sistema de Inventario Super Selectos
 * 
 * @author David
 * @version 2.5.1
 * @since 2025-10-28
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableTransactionManagement
public class SuperSelectosInventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(SuperSelectosInventoryApplication.class, args);
        System.out.println("\n" +
                "╔══════════════════════════════════════════════════════════════╗\n" +
                "║          🏢 SUPER SELECTOS - SISTEMA DE INVENTARIO          ║\n" +
                "║                     Versión 2.5.1                           ║\n" +
                "║              ✅ Aplicación iniciada exitosamente            ║\n" +
                "║                                                              ║\n" +
                "║  🌐 Dashboard: http://localhost:8080                        ║\n" +
                "║  📚 API Docs: http://localhost:8080/swagger-ui.html         ║\n" +
                "║  🔍 H2 Console: http://localhost:8080/h2-console            ║\n" +
                "║                                                              ║\n" +
                "║  👤 Admin: admin / admin123                                 ║\n" +
                "║  👨‍💼 Manager: manager / manager123                          ║\n" +
                "║  👷 Employee: employee / employee123                        ║\n" +
                "╚══════════════════════════════════════════════════════════════╝\n");
    }
}