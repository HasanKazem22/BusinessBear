package com.businessbear.server.repository;

import com.businessbear.server.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p WHERE " +
           "(CAST(:query AS string) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) OR LOWER(p.brandLogo) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))) AND " +
           "(CAST(:category AS string) IS NULL OR LOWER(p.category) = LOWER(CAST(:category AS string))) AND " +
           "(:activeOnly = false OR p.isActive = true)")
    List<Product> searchProducts(@Param("query") String query, @Param("category") String category, @Param("activeOnly") boolean activeOnly);

    List<Product> findByIsAvailableTrue();
}
