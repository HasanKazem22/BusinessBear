package com.businessbear.server.repository;

import com.businessbear.server.entity.AssetBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetBookingRepository extends JpaRepository<AssetBooking, Long> {
    List<AssetBooking> findByRealAssetIdOrderByCreatedAtDesc(Long realAssetId);
    List<AssetBooking> findAllByOrderByCreatedAtDesc();
}
