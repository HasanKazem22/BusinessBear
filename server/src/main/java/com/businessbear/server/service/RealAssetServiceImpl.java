package com.businessbear.server.service;

import com.businessbear.server.dto.AssetBookingRequestDto;
import com.businessbear.server.dto.RealAssetDto;
import com.businessbear.server.entity.AssetBooking;
import com.businessbear.server.entity.AssetStatus;
import com.businessbear.server.entity.BookingStatus;
import com.businessbear.server.entity.RealAsset;
import com.businessbear.server.repository.AssetBookingRepository;
import com.businessbear.server.repository.RealAssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RealAssetServiceImpl implements RealAssetService {

    private final RealAssetRepository realAssetRepository;
    private final AssetBookingRepository assetBookingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RealAssetDto> searchAssets(String query, AssetStatus status) {
        return realAssetRepository.searchAssets(query, status)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RealAssetDto getAssetById(Long id) {
        RealAsset asset = realAssetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Real Asset not found with id: " + id));
        return mapToDto(asset);
    }

    @Override
    @Transactional
    public RealAssetDto createAsset(RealAssetDto dto) {
        RealAsset asset = RealAsset.builder()
                .code(dto.getCode() != null ? dto.getCode() : "PROP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .title(dto.getTitle())
                .location(dto.getLocation())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .beds(dto.getBeds())
                .baths(dto.getBaths())
                .sqft(dto.getSqft())
                .status(dto.getStatus() != null ? dto.getStatus() : AssetStatus.FOR_SALE)
                .description(dto.getDescription())
                .isFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false)
                .build();
        RealAsset saved = realAssetRepository.save(asset);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public RealAssetDto updateAsset(Long id, RealAssetDto dto) {
        RealAsset asset = realAssetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Real Asset not found with id: " + id));

        if (dto.getCode() != null) asset.setCode(dto.getCode());
        asset.setTitle(dto.getTitle());
        asset.setLocation(dto.getLocation());
        asset.setPrice(dto.getPrice());
        if (dto.getImageUrl() != null) asset.setImageUrl(dto.getImageUrl());
        if (dto.getBeds() != null) asset.setBeds(dto.getBeds());
        if (dto.getBaths() != null) asset.setBaths(dto.getBaths());
        if (dto.getSqft() != null) asset.setSqft(dto.getSqft());
        if (dto.getStatus() != null) asset.setStatus(dto.getStatus());
        if (dto.getDescription() != null) asset.setDescription(dto.getDescription());
        if (dto.getIsFeatured() != null) asset.setIsFeatured(dto.getIsFeatured());

        RealAsset updated = realAssetRepository.save(asset);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteAsset(Long id) {
        realAssetRepository.deleteById(id);
    }

    @Override
    @Transactional
    public AssetBooking createAssetBooking(AssetBookingRequestDto bookingRequest) {
        RealAsset asset = realAssetRepository.findById(bookingRequest.getRealAssetId())
                .orElseThrow(() -> new RuntimeException("Real Asset not found with id: " + bookingRequest.getRealAssetId()));

        // Update Property Status automatically upon booking/sale
        if ("SALE".equalsIgnoreCase(bookingRequest.getBookingType())) {
            asset.setStatus(AssetStatus.JUST_SOLD);
        } else {
            asset.setStatus(AssetStatus.BOOKED);
        }
        realAssetRepository.save(asset);

        AssetBooking booking = AssetBooking.builder()
                .bookingNumber("BKG-" + System.currentTimeMillis())
                .realAsset(asset)
                .clientName(bookingRequest.getClientName())
                .clientEmail(bookingRequest.getClientEmail())
                .clientPhone(bookingRequest.getClientPhone())
                .agreedPrice(bookingRequest.getAgreedPrice() != null ? bookingRequest.getAgreedPrice() : asset.getPrice())
                .bookingType(bookingRequest.getBookingType() != null ? bookingRequest.getBookingType() : "BOOKING")
                .bookingStatus(BookingStatus.CONFIRMED)
                .build();

        return assetBookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetBooking> getAssetBookingHistory(Long assetId) {
        if (assetId != null) {
            return assetBookingRepository.findByRealAssetIdOrderByCreatedAtDesc(assetId);
        }
        return assetBookingRepository.findAllByOrderByCreatedAtDesc();
    }

    private RealAssetDto mapToDto(RealAsset entity) {
        return RealAssetDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .title(entity.getTitle())
                .location(entity.getLocation())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .beds(entity.getBeds())
                .baths(entity.getBaths())
                .sqft(entity.getSqft())
                .status(entity.getStatus())
                .description(entity.getDescription())
                .isFeatured(entity.getIsFeatured())
                .build();
    }
}
