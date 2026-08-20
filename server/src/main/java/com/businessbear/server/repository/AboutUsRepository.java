package com.businessbear.server.repository;

import com.businessbear.server.entity.AboutUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AboutUsRepository extends JpaRepository<AboutUs, Long> {
    Optional<AboutUs> findFirstByOrderByIdAsc();
}
