package com.businessbear.server.controller;

import com.businessbear.server.dto.AuthResponse;
import com.businessbear.server.dto.LoginRequest;
import com.businessbear.server.dto.RefreshTokenRequest;
import com.businessbear.server.dto.SignupRequest;
import com.businessbear.server.service.AuthService;
import com.businessbear.server.service.RolePermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RolePermissionService rolePermissionService;

    @GetMapping("/guest-permissions")
    public ResponseEntity<java.util.Map<String, Object>> getGuestPermissions() {
        return rolePermissionService.getByRoleName("GUEST")
                .map(rp -> ResponseEntity.ok(rp.getPermissionTree()))
                .orElse(ResponseEntity.ok(new java.util.HashMap<>()));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return new ResponseEntity<>(authService.signup(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }
}
