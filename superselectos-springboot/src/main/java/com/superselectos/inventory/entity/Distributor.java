package com.superselectos.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Distributor - Representa un distribuidor de productos
 * 
 * @author David
 * @version 2.5.1
 */
@Entity
@Table(name = "distributors", indexes = {
    @Index(name = "idx_distributor_name", columnList = "name"),
    @Index(name = "idx_distributor_email", columnList = "email")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Distributor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "contact_person", nullable = false, length = 100)
    private String contactPerson;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "country", length = 50)
    @Builder.Default
    private String country = "El Salvador";

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "distributor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Métodos de conveniencia
    public int getProductCount() {
        return products != null ? products.size() : 0;
    }

    public long getActiveProductCount() {
        return products != null ? 
            products.stream().filter(Product::getActive).count() : 0;
    }

    public String getFullContactInfo() {
        return String.format("%s - %s (%s)", contactPerson, phone, email);
    }

    public String getDisplayName() {
        return String.format("%s - %s", name, contactPerson);
    }
}