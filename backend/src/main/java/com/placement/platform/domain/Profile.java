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
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String resumeUrl;
    private String skills; // Comma separated for simplicity, or JSON
    private String university;
    private String degree;
    private Integer graduationYear;
    private String githubProfile;
    private String linkedinProfile;

    // AI Analysis Stats
    private Integer resumeScore;
}
