package com.businessbear.server.config;

import com.businessbear.server.entity.Permission;
import com.businessbear.server.entity.Role;
import com.businessbear.server.entity.User;
import com.businessbear.server.repository.PermissionRepository;
import com.businessbear.server.repository.RoleRepository;
import com.businessbear.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedPermissions();
        seedRoles();
        seedAdminUser();
    }

    private void seedPermissions() {
        List<String> permissionNames = Arrays.asList(
                "VIEW_USER_MANAGEMENT",
                "EDIT_USER",
                "CREATE_ROLE",
                "EDIT_ROLE",
                "VIEW_DASHBOARD",
                "MANAGE_PRODUCTS"
        );

        for (String name : permissionNames) {
            if (permissionRepository.findByName(name).isEmpty()) {
                permissionRepository.save(Permission.builder()
                        .name(name)
                        .description("Allows: " + name)
                        .build());
            }
        }
    }

    private void seedRoles() {
        // Create CUSTOMER role
        if (roleRepository.findByName("ROLE_CUSTOMER").isEmpty()) {
            Role customerRole = Role.builder()
                    .name("ROLE_CUSTOMER")
                    .description("Standard customer access")
                    .build();
            // Customers get basic dashboard access
            permissionRepository.findByName("VIEW_DASHBOARD").ifPresent(p -> customerRole.getPermissions().add(p));
            roleRepository.save(customerRole);
        }

        // Create ADMIN role
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .name("ROLE_ADMIN")
                    .description("Full administrative access")
                    .build();
            // Admins get ALL permissions
            List<Permission> allPermissions = permissionRepository.findAll();
            adminRole.getPermissions().addAll(allPermissions);
            roleRepository.save(adminRole);
        }
    }

    private void seedAdminUser() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            
            User admin = User.builder()
                    .fullName("System Administrator")
                    .username("admin")
                    .email("admin@businessbear.com")
                    .mobile("0000000000")
                    .password(passwordEncoder.encode("admin123")) // Change in production
                    .roles(Set.of(adminRole))
                    .build();
            
            userRepository.save(admin);
            System.out.println("====== Admin User Created: admin / admin123 ======");
        }
    }
}
