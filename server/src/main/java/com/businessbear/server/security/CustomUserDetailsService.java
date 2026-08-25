package com.businessbear.server.security;

import com.businessbear.server.repository.CustomerRepository;
import com.businessbear.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // 1. Check System Staff & Admin Users
        var staffOpt = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .or(() -> userRepository.findByMobile(identifier));

        if (staffOpt.isPresent()) {
            return staffOpt.get();
        }

        // 2. Check Public Customer Accounts
        var customerOpt = customerRepository.findByUsername(identifier)
                .or(() -> customerRepository.findByEmail(identifier))
                .or(() -> customerRepository.findByMobile(identifier));

        if (customerOpt.isPresent()) {
            return customerOpt.get();
        }

        throw new UsernameNotFoundException("Account not found with identifier: " + identifier);
    }
}
