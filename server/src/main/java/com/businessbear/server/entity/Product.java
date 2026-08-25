package com.businessbear.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Product extends BaseEntity {

    @Column(unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "buying_price", precision = 12, scale = 2, columnDefinition = "NUMERIC(12,2) DEFAULT 0")
    @Builder.Default
    private BigDecimal buyingPrice = BigDecimal.ZERO;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "brand_logo", length = 100)
    private String brandLogo;

    @Builder.Default
    private Double rating = 5.0;

    @Column(length = 100)
    private String category;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "sales_count", nullable = false)
    @Builder.Default
    private Integer salesCount = 0;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    @Builder.Default
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String description;
}
