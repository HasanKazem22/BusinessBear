package com.businessbear.server.repository;

import com.businessbear.server.entity.ProductSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSaleRepository extends JpaRepository<ProductSale, Long> {
    List<ProductSale> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<ProductSale> findAllByOrderByCreatedAtDesc();
}
