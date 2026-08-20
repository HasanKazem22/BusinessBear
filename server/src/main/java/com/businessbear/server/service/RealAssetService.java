package com.businessbear.server.service;

import com.businessbear.server.dto.AssetBookingRequestDto;
import com.businessbear.server.dto.RealAssetDto;
import com.businessbear.server.entity.AssetBooking;
import com.businessbear.server.entity.AssetStatus;

import java.util.List;

public interface RealAssetService {
    List<RealAssetDto> searchAssets(String query, AssetStatus status);
    RealAssetDto getAssetById(Long id);
    RealAssetDto createAsset(RealAssetDto dto);
    RealAssetDto updateAsset(Long id, RealAssetDto dto);
    void deleteAsset(Long id);

    // Booking & Sales Tracking
    AssetBooking createAssetBooking(AssetBookingRequestDto bookingRequest);
    List<AssetBooking> getAssetBookingHistory(Long assetId);
}
