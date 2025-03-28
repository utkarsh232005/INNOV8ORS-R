package com.blooddonation.controller;

import com.blooddonation.model.BloodRequest;
import com.blooddonation.model.User;
import com.blooddonation.service.BloodRequestService;
import com.blooddonation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BloodRequestService bloodRequestService;

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    // ✅ Get all users (Admin only)
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ Get donors by blood type
    @GetMapping("/donors/{bloodType}")
    public List<User> getAvailableDonors(@PathVariable String bloodType) {
        return userService.findAvailableDonors(bloodType);
    }
    
    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        // Only update allowed fields
        if (updatedUser.getFirstName() != null) {
            currentUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            currentUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getBloodType() != null) {
            currentUser.setBloodType(updatedUser.getBloodType());
        }
        if (updatedUser.getIsAvailable() != null) {
            currentUser.setIsAvailable(updatedUser.getIsAvailable());
        }
        
        return ResponseEntity.ok(userService.updateUser(currentUser));
    }

    // ✅ Create a blood request manually
    @PostMapping("/blood-request")
    public ResponseEntity<?> createBloodRequest(@RequestBody BloodRequest request) {
        BloodRequest newRequest = bloodRequestService.createRequest(request);
        return ResponseEntity.ok("Blood request created with ID: " + newRequest.getId());
    }
   
    // ✅ Allow a donor to accept a blood request
    @PostMapping("/blood-request/{requestId}/accept/{donorId}")
    public ResponseEntity<?> acceptBloodRequest(@PathVariable Long requestId, @PathVariable Long donorId) {
        bloodRequestService.acceptRequest(requestId, donorId);
        return ResponseEntity.ok("Blood request accepted by donor ID: " + donorId);
    }
}
