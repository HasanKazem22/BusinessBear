package com.businessbear.server.service;

import com.businessbear.server.dto.AuthResponse;
import com.businessbear.server.dto.LoginRequest;
import com.businessbear.server.dto.RefreshTokenRequest;
import com.businessbear.server.dto.SignupRequest;
import com.businessbear.server.entity.Customer;
import com.businessbear.server.entity.Role;
import com.businessbear.server.entity.User;
import com.businessbear.server.exception.UserAlreadyExistsException;
import com.businessbear.server.repository.CustomerRepository;
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

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RolePermissionService rolePermissionService;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) || customerRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByMobile(request.getMobile()) || customerRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException("Mobile number is already registered");
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty() &&
                (userRepository.existsByEmail(request.getEmail()) || customerRepository.existsByEmail(request.getEmail()))) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        // Create Customer Entity saved to 'customers' table
        Customer customer = Customer.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .build();

        customerRepository.save(customer);

        return buildAuthResponse(customer);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getIdentifier());
        return buildAuthResponse(userDetails);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        return buildAuthResponse(userDetails);
    }

    private AuthResponse buildAuthResponse(UserDetails userDetails) {
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        List<String> roleNames;
        Long userId = 0L;
        String username = userDetails.getUsername();
        String fullName = username;
        String email = "";

        if (userDetails instanceof User user) {
            userId = user.getId();
            fullName = user.getFullName();
            email = user.getEmail();
            roleNames = user.getRoles().stream().map(Role::getName).toList();
        } else if (userDetails instanceof Customer customer) {
            userId = customer.getId();
            fullName = customer.getFullName();
            email = customer.getEmail();
            roleNames = Collections.singletonList("ROLE_CUSTOMER");
        } else {
            roleNames = userDetails.getAuthorities().stream().map(a -> a.getAuthority()).toList();
        }

        Map<String, Object> rolePermissionTree = rolePermissionService.getMergedPermissionsForRoles(roleNames);

        AuthResponse.UserSummary userSummary = AuthResponse.UserSummary.builder()
                .id(userId)
                .username(username)
                .email(email)
                .roles(roleNames)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationTimeSeconds()) // 900 seconds (15 min)
                .user(userSummary)
                .rolePermission(rolePermissionTree)
                .token(accessToken) // Legacy compatibility
                .username(username)
                .fullName(fullName)
                .message("Authentication successful")
                .build();
    }
}
