package com.businessbear.server.repository;

import com.businessbear.server.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUsername(String username);
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByMobile(String mobile);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
}
