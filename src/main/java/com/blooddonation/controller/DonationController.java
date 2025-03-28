package com.blooddonation.controller;

import com.blooddonation.model.Donation;
import com.blooddonation.model.DonationStatus;
import com.blooddonation.model.User;
import com.blooddonation.service.DonationService;
import com.blooddonation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @Autowired
    private UserService userService;
    
    // Get all available donations (publicly accessible)
    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationService.getDonationsByStatus(DonationStatus.AVAILABLE);
    }
    
    // Get all donations (for admin)
    @GetMapping
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }
    
    // Get donations by blood type
    @GetMapping("/blood-type/{bloodType}")
    public List<Donation> getDonationsByBloodType(@PathVariable String bloodType) {
        return donationService.getDonationsByBloodType(bloodType);
    }
    
    // Get current user's donations (as a donor)
    @GetMapping("/my-donations")
    public List<Donation> getMyDonations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        return donationService.getDonationsByDonor(currentUser);
    }
    
    // Get current user's donation requests (as a recipient)
    @GetMapping("/my-requests")
    public List<Donation> getMyRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        return donationService.getDonationsByRecipient(currentUser);
    }
    
    // Create a new donation
    @PostMapping("/create")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        Donation newDonation = donationService.createDonation(donation, currentUser);
        return ResponseEntity.ok(newDonation);
    }
    
    // Request a donation as a recipient
    @PostMapping("/{donationId}/request")
    public ResponseEntity<Donation> requestDonation(@PathVariable Long donationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        Donation requestedDonation = donationService.requestDonation(donationId, currentUser);
        return ResponseEntity.ok(requestedDonation);
    }
    
    // Confirm a donation (donor confirms)
    @PostMapping("/{donationId}/confirm")
    public ResponseEntity<Donation> confirmDonation(@PathVariable Long donationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        Donation confirmedDonation = donationService.confirmDonation(donationId, currentUser);
        return ResponseEntity.ok(confirmedDonation);
    }
    
    // Cancel a donation request (recipient cancels)
    @PostMapping("/{donationId}/cancel-request")
    public ResponseEntity<Donation> cancelDonationRequest(@PathVariable Long donationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        Donation cancelledDonation = donationService.cancelDonationRequest(donationId, currentUser);
        return ResponseEntity.ok(cancelledDonation);
    }
    
    // Remove a donation listing (donor removes)
    @DeleteMapping("/{donationId}")
    public ResponseEntity<String> removeDonation(@PathVariable Long donationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email);
        
        try {
            donationService.removeDonation(donationId, currentUser);
            return ResponseEntity.ok("Donation removed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 