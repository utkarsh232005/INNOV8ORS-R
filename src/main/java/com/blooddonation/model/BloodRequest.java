package com.blooddonation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Getter @Setter
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private java.lang.Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private String bloodType;
    private String urgency;
    private String status = "pending"; // pending, fulfilled, canceled
    private LocalDateTime requestedAt = LocalDateTime.now();
}
