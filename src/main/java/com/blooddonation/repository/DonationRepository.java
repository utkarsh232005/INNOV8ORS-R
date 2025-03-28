package com.blooddonation.repository;

import com.blooddonation.model.Donation;
import com.blooddonation.model.DonationStatus;
import com.blooddonation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(User donor);
    List<Donation> findByRecipient(User recipient);
    List<Donation> findByStatus(DonationStatus status);
    List<Donation> findByBloodType(String bloodType);
} 