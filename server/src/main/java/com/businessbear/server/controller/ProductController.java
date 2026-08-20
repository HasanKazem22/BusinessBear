package com.businessbear.server.controller;

import com.businessbear.server.dto.ApiResponse;
import com.businessbear.server.dto.ProductDto;
import com.businessbear.server.dto.ProductSaleRequestDto;
import com.businessbear.server.entity.ProductSale;
import com.businessbear.server.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        List<ProductDto> products = productService.searchProducts(query, category);
        return ResponseEntity.ok(ApiResponse.success(products, "Products retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Product retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductDto dto) {
        ProductDto created = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Product created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto dto) {
        ProductDto updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }

    // POS Sales & Inventory Endpoint
    @PostMapping("/{id}/sale")
    public ResponseEntity<ApiResponse<ProductSale>> recordProductSale(
            @PathVariable Long id,
            @Valid @RequestBody ProductSaleRequestDto saleRequest) {
        saleRequest.setProductId(id);
        ProductSale sale = productService.recordProductSale(saleRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(sale, "POS Sale recorded and stock deducted successfully"));
    }

    @GetMapping("/sales/history")
    public ResponseEntity<ApiResponse<List<ProductSale>>> getSalesHistory(@RequestParam(required = false) Long productId) {
        List<ProductSale> history = productService.getProductSaleHistory(productId);
        return ResponseEntity.ok(ApiResponse.success(history, "Sales history retrieved successfully"));
    }
}
