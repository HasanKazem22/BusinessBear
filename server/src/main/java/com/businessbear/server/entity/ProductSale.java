package com.businessbear.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Entity
@Table(name = "product_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProductSale extends BaseEntity {

    @Column(name = "transaction_number", unique = true, nullable = false, length = 100)
    private String transactionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "buyer_name", length = 150)
    private String buyerName;

    @Column(name = "buyer_phone", length = 50)
    private String buyerPhone;

    @Column(name = "payment_status", length = 50)
    @Builder.Default
    private String paymentStatus = "PAID";
}
