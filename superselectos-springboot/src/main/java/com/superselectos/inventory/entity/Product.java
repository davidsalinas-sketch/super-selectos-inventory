package com.superselectos.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Entidad Product - Representa un producto en el inventario
 * 
 * @author David
 * @version 2.5.1
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_code", columnList = "code"),
    @Index(name = "idx_product_category", columnList = "category"),
    @Index(name = "idx_product_distributor", columnList = "distributor_id")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private ProductCategory category;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distributor_id")
    private Distributor distributor;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "profit_margin", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal profitMargin = BigDecimal.ZERO;

    /**
     * Stock por sucursal almacenado como JSON
     * Clave: número de sucursal (1-118)
     * Valor: cantidad en stock
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_branch_stock", 
                    joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "branch_number")
    @Column(name = "stock_quantity")
    @Builder.Default
    private Map<Integer, Integer> branchStock = new HashMap<>();

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Métodos de conveniencia
    public Integer getTotalStock() {
        return branchStock.values().stream()
                .mapToInt(Integer::intValue)
                .sum();
    }

    public BigDecimal getTotalInventoryValue() {
        return price.multiply(BigDecimal.valueOf(getTotalStock()));
    }

    public BigDecimal getEstimatedProfit() {
        BigDecimal cost = price.divide(
            BigDecimal.ONE.add(profitMargin.divide(BigDecimal.valueOf(100))), 
            2, 
            java.math.RoundingMode.HALF_UP
        );
        return price.subtract(cost).multiply(BigDecimal.valueOf(getTotalStock()));
    }

    public boolean isNearExpiration(int daysThreshold) {
        if (expirationDate == null) return false;
        return expirationDate.isBefore(LocalDate.now().plusDays(daysThreshold));
    }

    public int getActiveBranchesCount() {
        return (int) branchStock.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .count();
    }

    /**
     * Enum para categorías de productos
     */
    public enum ProductCategory {
        ALIMENTOS("Alimentos"),
        BEBIDAS("Bebidas"),
        CARNES("Carnes"),
        FRUTAS("Frutas"),
        LIMPIEZA("Limpieza"),
        JUGUETES("Juguetes"),
        OTROS("Otros");

        private final String displayName;

        ProductCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}