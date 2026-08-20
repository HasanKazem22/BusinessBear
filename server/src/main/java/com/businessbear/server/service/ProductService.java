package com.businessbear.server.service;

import com.businessbear.server.dto.ProductDto;
import com.businessbear.server.dto.ProductSaleRequestDto;
import com.businessbear.server.entity.ProductSale;

import java.util.List;

public interface ProductService {
    List<ProductDto> searchProducts(String query, String category);
    ProductDto getProductById(Long id);
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);

    // POS Sales & Stock Deduction
    ProductSale recordProductSale(ProductSaleRequestDto saleRequest);
    List<ProductSale> getProductSaleHistory(Long productId);
}
