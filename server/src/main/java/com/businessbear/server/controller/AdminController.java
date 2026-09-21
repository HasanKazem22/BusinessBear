package com.businessbear.server.controller;

import com.businessbear.server.dto.AdminUserRequest;
import com.businessbear.server.dto.CreateRoleRequest;
import com.businessbear.server.dto.RoleAssignmentRequest;
import com.businessbear.server.dto.UserStatusRequest;
import com.businessbear.server.entity.Permission;
import com.businessbear.server.entity.Role;
import com.businessbear.server.entity.User;
import com.businessbear.server.repository.PermissionRepository;
import com.businessbear.server.repository.RoleRepository;
import com.businessbear.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<User> createUser(@RequestBody AdminUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            roles.addAll(roleRepository.findAllById(request.getRoleIds()));
        } else {
            roleRepository.findByName("CUSTOMER").ifPresent(roles::add);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword() != null && !request.getPassword().isBlank() ? request.getPassword() : "123456"))
                .roles(roles)
                .isActive(true)
                .build();

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody AdminUserRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getUsername() != null && !request.getUsername().isBlank()) user.setUsername(request.getUsername());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getMobile() != null) user.setMobile(request.getMobile());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRoleIds() != null) {
            Set<Role> roles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            user.setRoles(roles);
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{userId}/roles")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<User> updateUserRoles(@PathVariable Long userId, @RequestBody RoleAssignmentRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Long> roleIds = request.getRoleIds();
        
        Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
        user.setRoles(roles);
        
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long userId, @RequestBody UserStatusRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setIsActive(request.getIsActive());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if ("admin".equalsIgnoreCase(user.getUsername())) {
            throw new RuntimeException("Cannot delete default Super Admin user.");
        }
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    // ==================== ROLE BUILDER ====================

    @GetMapping("/roles")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @PostMapping("/roles")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Role> createRole(@RequestBody CreateRoleRequest request) {
        String name = request.getName().toUpperCase().replace(" ", "_");
        String description = request.getDescription();

        Role role = Role.builder()
                .name(name)
                .description(description)
                .build();
        
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @PutMapping("/roles/{roleId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Role> updateRole(@PathVariable Long roleId, @RequestBody CreateRoleRequest request) {
        Role role = roleRepository.findById(roleId).orElseThrow();
        if (request.getName() != null && !request.getName().isBlank()) {
            role.setName(request.getName());
        }
        if (request.getDescription() != null) {
            role.setDescription(request.getDescription());
        }
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @DeleteMapping("/roles/{roleId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long roleId) {
        Role role = roleRepository.findById(roleId).orElseThrow();
        if (role.getName().equals("ADMIN")) {
            throw new RuntimeException("Cannot delete built-in Super Admin role.");
        }
        roleRepository.delete(role);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }
}
