package com.businessbear.server.repository;

import com.businessbear.server.entity.AssetStatus;
import com.businessbear.server.entity.RealAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealAssetRepository extends JpaRepository<RealAsset, Long>, JpaSpecificationExecutor<RealAsset> {

    @Query("SELECT r FROM RealAsset r WHERE " +
           "(:query IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    List<RealAsset> searchAssets(@Param("query") String query, @Param("status") AssetStatus status);

    List<RealAsset> findByIsFeaturedTrue();
}
