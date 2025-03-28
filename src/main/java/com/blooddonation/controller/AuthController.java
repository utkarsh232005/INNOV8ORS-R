package com.blooddonation.controller;

import com.blooddonation.model.LoginRequest;
import com.blooddonation.model.LoginResponse;
import com.blooddonation.model.RegisterRequest;
import com.blooddonation.model.User;
import com.blooddonation.service.AuthService;
import com.blooddonation.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/test-connection")
    public ResponseEntity<Map<String, String>> testConnection() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Connection successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // First authenticate and get response
        LoginResponse response = authService.login(loginRequest);
        
        try {
            // Then update user profile with login information
            User user = userService.findByEmail(loginRequest.getEmail());
            
            // Update last login time and device info if provided
            user.setLastLoginTime(java.time.LocalDateTime.now());
            
            if (loginRequest.getDeviceInfo() != null) {
                user.setLastLoginDevice(loginRequest.getDeviceInfo());
            }
            
            // Increment login count
            Integer loginCount = user.getLoginCount();
            if (loginCount == null) {
                loginCount = 0;
            }
            user.setLoginCount(loginCount + 1);
            
            // Save the updated user profile
            userService.updateUser(user);
        } catch (Exception e) {
            // Log the error but don't fail the login
            System.err.println("Error updating user profile: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
