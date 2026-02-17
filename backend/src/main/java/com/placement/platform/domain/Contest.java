package com.placement.platform.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contests")
public class Contest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String platform; // LeetCode, CodeChef, etc.
    private String link;
    private LocalDateTime startTime;
    private String duration;
    private String status; // UPCOMING, ONGOING
}
