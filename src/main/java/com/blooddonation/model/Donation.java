package com.blooddonation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    private String bloodType;
    private String contactNumber;
    private String availability;
    private String location;
    private String additionalInfo;
    private LocalDateTime listedOn = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    private DonationStatus status = DonationStatus.AVAILABLE;
    
    // Used by recipients to track requests
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;
} 