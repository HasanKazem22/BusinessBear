package com.businessbear.server.service;

import com.businessbear.server.dto.ProductDto;
import com.businessbear.server.dto.ProductSaleRequestDto;
import com.businessbear.server.entity.Product;
import com.businessbear.server.entity.ProductSale;
import com.businessbear.server.repository.ProductRepository;
import com.businessbear.server.repository.ProductSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductSaleRepository productSaleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String query, String category) {
        return productRepository.searchProducts(query, category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToDto(product);
    }

    @Override
    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = Product.builder()
                .sku(dto.getSku() != null ? dto.getSku() : "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .name(dto.getName())
                .price(dto.getPrice())
                .originalPrice(dto.getOriginalPrice())
                .imageUrl(dto.getImageUrl())
                .brandLogo(dto.getBrandLogo())
                .rating(dto.getRating() != null ? dto.getRating() : 5.0)
                .category(dto.getCategory() != null ? dto.getCategory() : "Electronics")
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .salesCount(0)
                .isAvailable(dto.getStockQuantity() != null && dto.getStockQuantity() > 0)
                .description(dto.getDescription())
                .build();
        Product saved = productRepository.save(product);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (dto.getSku() != null) product.setSku(dto.getSku());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setOriginalPrice(dto.getOriginalPrice());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getBrandLogo() != null) product.setBrandLogo(dto.getBrandLogo());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getStockQuantity() != null) {
            product.setStockQuantity(dto.getStockQuantity());
            product.setIsAvailable(dto.getStockQuantity() > 0);
        }
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());

        Product updated = productRepository.save(product);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ProductSale recordProductSale(ProductSaleRequestDto saleRequest) {
        Product product = productRepository.findById(saleRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + saleRequest.getProductId()));

        int qty = saleRequest.getQuantity();
        if (product.getStockQuantity() < qty) {
            throw new RuntimeException("Insufficient stock available! Current stock: " + product.getStockQuantity());
        }

        // Deduct stock quantity and update sales count
        product.setStockQuantity(product.getStockQuantity() - qty);
        product.setSalesCount(product.getSalesCount() + qty);
        if (product.getStockQuantity() == 0) {
            product.setIsAvailable(false);
        }
        productRepository.save(product);

        // Record Sale Transaction
        BigDecimal totalAmount = product.getPrice().multiply(BigDecimal.valueOf(qty));
        ProductSale sale = ProductSale.builder()
                .transactionNumber("TXN-" + System.currentTimeMillis())
                .product(product)
                .quantity(qty)
                .unitPrice(product.getPrice())
                .totalAmount(totalAmount)
                .buyerName(saleRequest.getBuyerName() != null ? saleRequest.getBuyerName() : "Walk-in Customer")
                .buyerPhone(saleRequest.getBuyerPhone())
                .paymentStatus(saleRequest.getPaymentStatus() != null ? saleRequest.getPaymentStatus() : "PAID")
                .build();

        return productSaleRepository.save(sale);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSale> getProductSaleHistory(Long productId) {
        if (productId != null) {
            return productSaleRepository.findByProductIdOrderByCreatedAtDesc(productId);
        }
        return productSaleRepository.findAllByOrderByCreatedAtDesc();
    }

    private ProductDto mapToDto(Product entity) {
        return ProductDto.builder()
                .id(entity.getId())
                .sku(entity.getSku())
                .name(entity.getName())
                .price(entity.getPrice())
                .originalPrice(entity.getOriginalPrice())
                .imageUrl(entity.getImageUrl())
                .brandLogo(entity.getBrandLogo())
                .rating(entity.getRating())
                .category(entity.getCategory())
                .stockQuantity(entity.getStockQuantity())
                .salesCount(entity.getSalesCount())
                .isAvailable(entity.getIsAvailable())
                .description(entity.getDescription())
                .build();
    }
}
