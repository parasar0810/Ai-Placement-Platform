package com.placement.platform.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dsa_questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String topic; // Arrays, Strings, DP, etc.

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String link; // LeetCode/GFG link
}
