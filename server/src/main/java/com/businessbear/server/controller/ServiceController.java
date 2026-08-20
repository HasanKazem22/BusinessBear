package com.businessbear.server.controller;

import com.businessbear.server.dto.ApiResponse;
import com.businessbear.server.dto.ServiceDto;
import com.businessbear.server.service.ServiceItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceItemService serviceItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getActiveServices() {
        List<ServiceDto> services = serviceItemService.getAllActiveServices();
        return ResponseEntity.ok(ApiResponse.success(services, "Active services fetched successfully"));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getAllServicesAdmin() {
        List<ServiceDto> services = serviceItemService.getAllServicesAdmin();
        return ResponseEntity.ok(ApiResponse.success(services, "All services fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDto>> getServiceById(@PathVariable Long id) {
        ServiceDto service = serviceItemService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.success(service, "Service fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceDto>> createService(@Valid @RequestBody ServiceDto dto) {
        ServiceDto created = serviceItemService.createService(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Service created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDto>> updateService(@PathVariable Long id, @Valid @RequestBody ServiceDto dto) {
        ServiceDto updated = serviceItemService.updateService(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Service updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        serviceItemService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Service deleted successfully"));
    }
}
