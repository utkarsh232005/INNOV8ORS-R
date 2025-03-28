package com.blooddonation.service;

import com.blooddonation.model.Donation;
import com.blooddonation.model.DonationStatus;
import com.blooddonation.model.User;
import com.blooddonation.repository.DonationRepository;
import com.blooddonation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all donations
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
    
    // Get donations by status
    public List<Donation> getDonationsByStatus(DonationStatus status) {
        return donationRepository.findByStatus(status);
    }
    
    // Get donations by blood type
    public List<Donation> getDonationsByBloodType(String bloodType) {
        return donationRepository.findByBloodType(bloodType);
    }
    
    // Get donations by donor
    public List<Donation> getDonationsByDonor(User donor) {
        return donationRepository.findByDonor(donor);
    }
    
    // Get donations requested by recipient
    public List<Donation> getDonationsByRecipient(User recipient) {
        return donationRepository.findByRecipient(recipient);
    }
    
    // Create a new donation
    public Donation createDonation(Donation donation, User donor) {
        donation.setDonor(donor);
        donation.setStatus(DonationStatus.AVAILABLE);
        return donationRepository.save(donation);
    }
    
    // Request a donation as a recipient
    public Donation requestDonation(Long donationId, User recipient) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new NoSuchElementException("Donation not found with id: " + donationId));
        
        // Check if donation is available
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new IllegalStateException("Donation is not available for request");
        }
        
        donation.setRecipient(recipient);
        donation.setStatus(DonationStatus.PENDING);
        return donationRepository.save(donation);
    }
    
    // Confirm a donation (donor confirms the donation)
    public Donation confirmDonation(Long donationId, User donor) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new NoSuchElementException("Donation not found with id: " + donationId));
        
        // Check if donor owns this donation
        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new IllegalStateException("You don't have permission to confirm this donation");
        }
        
        // Check if donation is in PENDING state
        if (donation.getStatus() != DonationStatus.PENDING) {
            throw new IllegalStateException("Donation must be in PENDING state to confirm");
        }
        
        donation.setStatus(DonationStatus.COMPLETED);
        return donationRepository.save(donation);
    }
    
    // Cancel a donation request (recipient cancels)
    public Donation cancelDonationRequest(Long donationId, User recipient) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new NoSuchElementException("Donation not found with id: " + donationId));
        
        // Check if recipient owns this request
        if (!donation.getRecipient().getId().equals(recipient.getId())) {
            throw new IllegalStateException("You don't have permission to cancel this request");
        }
        
        // Reset the donation to available
        donation.setRecipient(null);
        donation.setStatus(DonationStatus.AVAILABLE);
        return donationRepository.save(donation);
    }
    
    // Remove a donation listing (donor removes their listing)
    public void removeDonation(Long donationId, User donor) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new NoSuchElementException("Donation not found with id: " + donationId));
        
        // Check if donor owns this donation
        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new IllegalStateException("You don't have permission to remove this donation");
        }
        
        // If donation is pending, it can't be removed
        if (donation.getStatus() == DonationStatus.PENDING) {
            throw new IllegalStateException("Cannot remove a donation that is pending. Please cancel the request first.");
        }
        
        donationRepository.delete(donation);
    }
} 