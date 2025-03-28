package com.blooddonation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blooddonation.model.BloodRequest;
import com.blooddonation.model.User;
import com.blooddonation.repository.BloodRequestRepository;
import com.blooddonation.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all blood requests
    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }
    
    // Get blood requests by status
    public List<BloodRequest> getRequestsByStatus(String status) {
        return bloodRequestRepository.findByStatus(status);
    }
    
    // Get blood requests by recipient
    public List<BloodRequest> getRequestsByRecipient(User recipient) {
        return bloodRequestRepository.findByRecipient(recipient);
    }

    // Create a new blood request without recipient
    public BloodRequest createRequest(BloodRequest request) {
        return bloodRequestRepository.save(request);
    }

    // Accept a blood request
    public void acceptRequest(Long requestId, Long donorId) {
        // ✅ Find the blood request
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found"));
        System.out.println("Found Blood Request ID: " + requestId + " with status: " + request.getStatus());

        // ✅ Find the donor
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        System.out.println("Found Donor ID: " + donorId + " with blood type: " + donor.getBloodType());

        // ✅ Check if donor has the same blood type as requested
        if (!request.getBloodType().equalsIgnoreCase(donor.getBloodType())) {
            throw new RuntimeException("Donor blood type does not match the request.");
        }

        // ✅ Update the request status
        request.setStatus("fulfilled");
        bloodRequestRepository.save(request);
        System.out.println("Updated Blood Request ID: " + requestId + " to status: " + request.getStatus());
    }
    
    // Cancel a blood request
    public void cancelRequest(Long requestId, Long userId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Blood request not found"));
        
        // Check if the current user is the owner of this request
        if (!request.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this request");
        }
        
        // Check if the request is already fulfilled or canceled
        if (!"pending".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Cannot cancel a request that is not pending");
        }
        
        request.setStatus("canceled");
        bloodRequestRepository.save(request);
    }
}
