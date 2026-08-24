package com.businessbear.server.service;

import com.businessbear.server.dto.AuthResponse;
import com.businessbear.server.dto.LoginRequest;
import com.businessbear.server.dto.RefreshTokenRequest;
import com.businessbear.server.dto.SignupRequest;
import com.businessbear.server.entity.Role;
import com.businessbear.server.entity.User;
import com.businessbear.server.exception.UserAlreadyExistsException;
import com.businessbear.server.repository.RoleRepository;
import com.businessbear.server.repository.UserRepository;
import com.businessbear.server.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RolePermissionService rolePermissionService;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException("Mobile number is already registered");
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty() && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        Role defaultRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> {
                    Role role = Role.builder().name("ROLE_CUSTOMER").description("Default customer role").build();
                    return roleRepository.save(role);
                });

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        
        user.getRoles().add(defaultRole);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getIdentifier())
                .orElseGet(() -> userRepository.findByEmail(request.getIdentifier())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtService.generateToken(userDetails);

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        Map<String, Object> rolePermissionTree = rolePermissionService.getMergedPermissionsForRoles(roleNames);

        AuthResponse.UserSummary userSummary = AuthResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationTimeSeconds()) // 900 seconds (15 min)
                .user(userSummary)
                .rolePermission(rolePermissionTree)
                .token(accessToken) // Legacy compatibility
                .username(user.getUsername())
                .fullName(user.getFullName())
                .message("Authentication successful")
                .build();
    }
}
