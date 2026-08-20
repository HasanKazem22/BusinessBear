package com.businessbear.server.controller;

import com.businessbear.server.dto.ApiResponse;
import com.businessbear.server.dto.AssetBookingRequestDto;
import com.businessbear.server.dto.RealAssetDto;
import com.businessbear.server.entity.AssetBooking;
import com.businessbear.server.entity.AssetStatus;
import com.businessbear.server.service.RealAssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/real-assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RealAssetController {

    private final RealAssetService realAssetService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RealAssetDto>>> searchAssets(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) AssetStatus status) {
        List<RealAssetDto> assets = realAssetService.searchAssets(query, status);
        return ResponseEntity.ok(ApiResponse.success(assets, "Real assets retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RealAssetDto>> getAssetById(@PathVariable Long id) {
        RealAssetDto asset = realAssetService.getAssetById(id);
        return ResponseEntity.ok(ApiResponse.success(asset, "Real asset retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RealAssetDto>> createAsset(@Valid @RequestBody RealAssetDto dto) {
        RealAssetDto created = realAssetService.createAsset(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Real asset listing created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RealAssetDto>> updateAsset(@PathVariable Long id, @Valid @RequestBody RealAssetDto dto) {
        RealAssetDto updated = realAssetService.updateAsset(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Real asset listing updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable Long id) {
        realAssetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Real asset listing deleted successfully"));
    }

    // Property Booking & Sales Lead Endpoint
    @PostMapping("/{id}/booking")
    public ResponseEntity<ApiResponse<AssetBooking>> createAssetBooking(
            @PathVariable Long id,
            @Valid @RequestBody AssetBookingRequestDto bookingRequest) {
        bookingRequest.setRealAssetId(id);
        AssetBooking booking = realAssetService.createAssetBooking(bookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(booking, "Property booking recorded and status updated successfully"));
    }

    @GetMapping("/bookings/history")
    public ResponseEntity<ApiResponse<List<AssetBooking>>> getBookingHistory(@RequestParam(required = false) Long assetId) {
        List<AssetBooking> history = realAssetService.getAssetBookingHistory(assetId);
        return ResponseEntity.ok(ApiResponse.success(history, "Property booking history retrieved successfully"));
    }
}
