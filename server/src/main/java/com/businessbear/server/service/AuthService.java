package com.businessbear.server.service;

import com.businessbear.server.dto.AuthResponse;
import com.businessbear.server.dto.LoginRequest;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Validate duplicates
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException("Mobile number is already registered");
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty() && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        // Get default role (CUSTOMER) or create it if missing (for dev safety)
        Role defaultRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> {
                    Role role = Role.builder().name("ROLE_CUSTOMER").description("Default customer role").build();
                    return roleRepository.save(role);
                });

        // Create User
        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        
        user.getRoles().add(defaultRole);

        userRepository.save(user);

        // Auto-login after signup (Optional, but good UX)
        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate (this will check password and if account is disabled)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(),
                        request.getPassword()
                )
        );

        // Load user
        User user = userRepository.findByUsername(request.getIdentifier())
                .orElseGet(() -> userRepository.findByEmail(request.getIdentifier())
                        .orElseThrow()); // Should not happen if auth succeeded

        // Generate token
        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .message("Login successful")
                .build();
    }
}
