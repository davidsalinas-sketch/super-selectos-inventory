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
import java.time.LocalDateTime;

/**
 * Entidad Branch - Representa una sucursal de Super Selectos
 * 
 * @author David
 * @version 2.5.1
 */
@Entity
@Table(name = "branches", indexes = {
    @Index(name = "idx_branch_number", columnList = "branch_number"),
    @Index(name = "idx_branch_department", columnList = "department"),
    @Index(name = "idx_branch_city", columnList = "city")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "branch_number", unique = true, nullable = false)
    private Integer branchNumber;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "address", nullable = false, length = 200)
    private String address;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "department", nullable = false, length = 50)
    private String department;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "opening_hours", length = 100)
    @Builder.Default
    private String openingHours = "Lunes a Domingo: 6:00 AM - 10:00 PM";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Métodos de conveniencia
    public String getDisplayName() {
        return String.format("Sucursal %d - %s", branchNumber, name);
    }

    public String getFullAddress() {
        return String.format("%s, %s, %s", address, city, department);
    }

    public String getLocationKey() {
        return "Sucursal " + branchNumber;
    }

    public boolean hasCoordinates() {
        return latitude != null && longitude != null;
    }

    public String getCoordinatesString() {
        if (!hasCoordinates()) return "Sin coordenadas";
        return String.format("%.6f, %.6f", latitude, longitude);
    }
}