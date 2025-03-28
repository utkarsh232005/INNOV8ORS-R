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
@RequestMapping("/requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BloodRequestController {
    @Autowired
    private BloodRequestService bloodRequestService;
    
    @Autowired
    private UserService userService;

    // Get all blood requests
    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return bloodRequestService.getAllRequests();
    }
    
    // Get blood requests by status
    @GetMapping("/status/{status}")
    public List<BloodRequest> getRequestsByStatus(@PathVariable String status) {
        return bloodRequestService.getRequestsByStatus(status);
    }
    
    // Get current user's blood requests
    @GetMapping("/my-requests")
    public List<BloodRequest> getMyRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        return bloodRequestService.getRequestsByRecipient(currentUser);
    }

    // Create a new blood request
    @PostMapping("/create")
    public ResponseEntity<BloodRequest> createRequest(@RequestBody BloodRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        // Set the current user as the recipient
        request.setRecipient(currentUser);
        
        return ResponseEntity.ok(bloodRequestService.createRequest(request));
    }
    
    // Cancel a blood request
    @PostMapping("/{requestId}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable Long requestId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        bloodRequestService.cancelRequest(requestId, currentUser.getId());
        return ResponseEntity.ok("Blood request cancelled successfully");
    }
}
