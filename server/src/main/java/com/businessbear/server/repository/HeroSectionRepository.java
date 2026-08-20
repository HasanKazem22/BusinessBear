package com.businessbear.server.repository;

import com.businessbear.server.entity.HeroSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HeroSectionRepository extends JpaRepository<HeroSection, Long> {
    Optional<HeroSection> findFirstByOrderByIdAsc();
}
