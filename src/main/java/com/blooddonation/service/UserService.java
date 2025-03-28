package com.blooddonation.service;

import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get donors by blood type
    public List<User> findAvailableDonors(String bloodType) {
        return userRepository.findByBloodType(bloodType);
    }
    
    // Find user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found with email: " + email));
    }
    
    // Update user profile
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    // Check if user exists by email
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
