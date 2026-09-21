package com.businessbear.server.dto;

import com.businessbear.server.entity.Customer;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String postalCode;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Map<String, Object>> roles;

    public static CustomerDTO fromEntity(Customer customer) {
        if (customer == null) return null;
        return CustomerDTO.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .username(customer.getUsername())
                .email(customer.getEmail())
                .mobile(customer.getMobile())
                .address(customer.getAddress())
                .city(customer.getCity())
                .postalCode(customer.getPostalCode())
                .isActive(customer.getIsActive())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .roles(Collections.singletonList(Map.of("id", 0L, "name", "CUSTOMER", "description", "Customer Account")))
                .build();
    }
}
