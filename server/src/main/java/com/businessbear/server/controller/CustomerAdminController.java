package com.businessbear.server.controller;

import com.businessbear.server.dto.CustomerDTO;
import com.businessbear.server.dto.UserStatusRequest;
import com.businessbear.server.entity.Customer;
import com.businessbear.server.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'MANAGER')")
public class CustomerAdminController {

    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Customer> customers = customerRepository.findAll(
                PageRequest.of(page, size, Sort.by("id").descending())
        );

        Page<CustomerDTO> dtos = customers.map(c -> CustomerDTO.builder()
                .id(c.getId())
                .fullName(c.getFullName())
                .username(c.getUsername())
                .email(c.getEmail())
                .mobile(c.getMobile())
                .isActive(c.getIsActive())
                .build());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @RequestBody Customer form) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        if (form.getFullName() != null) customer.setFullName(form.getFullName());
        if (form.getUsername() != null && !form.getUsername().isBlank()) customer.setUsername(form.getUsername());
        if (form.getEmail() != null) customer.setEmail(form.getEmail());
        if (form.getMobile() != null) customer.setMobile(form.getMobile());
        if (form.getAddress() != null) customer.setAddress(form.getAddress());
        if (form.getCity() != null) customer.setCity(form.getCity());
        if (form.getPostalCode() != null) customer.setPostalCode(form.getPostalCode());
        
        Customer saved = customerRepository.save(customer);
        return ResponseEntity.ok(CustomerDTO.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .mobile(saved.getMobile())
                .isActive(saved.getIsActive())
                .build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> toggleCustomerStatus(@PathVariable Long id, @RequestBody UserStatusRequest request) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setIsActive(request.getIsActive());
        customerRepository.save(customer);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
        return ResponseEntity.ok().build();
    }
}
