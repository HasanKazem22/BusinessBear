package com.businessbear.server.controller;

import com.businessbear.server.entity.Permission;
import com.businessbear.server.entity.Role;
import com.businessbear.server.entity.User;
import com.businessbear.server.repository.PermissionRepository;
import com.businessbear.server.repository.RoleRepository;
import com.businessbear.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.businessbear.server.dto.CreateRoleRequest;
import com.businessbear.server.dto.RoleAssignmentRequest;
import com.businessbear.server.dto.UserStatusRequest;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('VIEW_USER_MANAGEMENT')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{userId}/roles")
    @PreAuthorize("hasAuthority('EDIT_USER')")
    public ResponseEntity<User> updateUserRoles(@PathVariable Long userId, @RequestBody RoleAssignmentRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Long> roleIds = request.getRoleIds();
        
        Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
        user.setRoles(roles);
        
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasAuthority('EDIT_USER')")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long userId, @RequestBody UserStatusRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setIsActive(request.getIsActive());
        return ResponseEntity.ok(userRepository.save(user));
    }


    // ==================== ROLE BUILDER ====================

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('VIEW_USER_MANAGEMENT')") // or specific role permission
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    public ResponseEntity<Role> createRole(@RequestBody CreateRoleRequest request) {
        String name = request.getName();
        String description = request.getDescription();
        List<Long> permissionIds = request.getPermissionIds();

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionIds));

        Role role = Role.builder()
                .name(name)
                .description(description)
                .permissions(permissions)
                .build();
        
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }
}
