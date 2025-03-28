package com.blooddonation.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blooddonation.model.LoginRequest;
import com.blooddonation.model.LoginResponse;
import com.blooddonation.model.RegisterRequest;
import com.blooddonation.model.Role;
import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;
import com.blooddonation.security.JWTUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public LoginResponse register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setBloodType(registerRequest.getBloodType());
        user.setRole(Role.valueOf(registerRequest.getRole())); // Convert string to ENUM

        userRepository.save(user);
        
        // Generate token for the newly registered user
        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token, "Registration successful");
    }

    public LoginResponse login(LoginRequest loginRequest) {
        return login(loginRequest.getEmail(), loginRequest.getPassword());
    }
    
    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token, "Login successful");
    }
}
