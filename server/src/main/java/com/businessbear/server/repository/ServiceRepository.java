package com.businessbear.server.repository;

import com.businessbear.server.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByIsActiveTrueOrderByDisplayOrderAscIdAsc();
    List<Service> findAllByOrderByDisplayOrderAscIdAsc();
}
