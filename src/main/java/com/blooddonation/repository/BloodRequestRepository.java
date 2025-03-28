package com.blooddonation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.BloodRequest;
import com.blooddonation.model.User;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(String status);
    List<BloodRequest> findByRecipient(User recipient);
    List<BloodRequest> findByBloodType(String bloodType);
}
