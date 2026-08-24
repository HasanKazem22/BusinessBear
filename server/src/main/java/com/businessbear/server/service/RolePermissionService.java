package com.businessbear.server.service;

import com.businessbear.server.entity.RolePermission;
import com.businessbear.server.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getMergedPermissionsForRoles(List<String> roleNames) {
        if (roleNames == null || roleNames.isEmpty()) {
            return new HashMap<>();
        }

        List<RolePermission> rolePermissions = rolePermissionRepository.findByRoleNameIn(roleNames);
        Map<String, Object> mergedTree = new HashMap<>();

        for (RolePermission rp : rolePermissions) {
            if (rp.getPermissionTree() != null) {
                mergeMaps(mergedTree, rp.getPermissionTree());
            }
        }
        return mergedTree;
    }

    @Transactional(readOnly = true)
    public Optional<RolePermission> getByRoleName(String roleName) {
        return rolePermissionRepository.findByRoleName(roleName);
    }

    @Transactional
    public RolePermission saveOrUpdateRolePermission(String roleName, Map<String, Object> permissionTree) {
        RolePermission rolePermission = rolePermissionRepository.findByRoleName(roleName)
                .orElse(RolePermission.builder()
                        .roleName(roleName)
                        .build());
        rolePermission.setPermissionTree(permissionTree);
        return rolePermissionRepository.save(rolePermission);
    }

    @SuppressWarnings("unchecked")
    private void mergeMaps(Map<String, Object> target, Map<String, Object> source) {
        for (Map.Entry<String, Object> entry : source.entrySet()) {
            String key = entry.getKey();
            Object sourceVal = entry.getValue();

            if (sourceVal instanceof Map) {
                Map<String, Object> targetChild = (Map<String, Object>) target.computeIfAbsent(key, k -> new HashMap<String, Object>());
                mergeMaps(targetChild, (Map<String, Object>) sourceVal);
            } else if (sourceVal instanceof Boolean) {
                Boolean current = (Boolean) target.getOrDefault(key, false);
                target.put(key, current || (Boolean) sourceVal);
            } else {
                target.put(key, sourceVal);
            }
        }
    }
}
