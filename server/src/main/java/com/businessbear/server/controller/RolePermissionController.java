package com.businessbear.server.controller;

import com.businessbear.server.entity.RolePermission;
import com.businessbear.server.service.RolePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/role-permissions")
@RequiredArgsConstructor
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @GetMapping("/{roleName}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<RolePermission> getRolePermission(@PathVariable String roleName) {
        return rolePermissionService.getByRoleName(roleName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{roleName}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<RolePermission> updateRolePermission(
            @PathVariable String roleName,
            @RequestBody Map<String, Object> permissionTree
    ) {
        RolePermission updated = rolePermissionService.saveOrUpdateRolePermission(roleName, permissionTree);
        return ResponseEntity.ok(updated);
    }
}
