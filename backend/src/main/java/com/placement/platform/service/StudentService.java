package com.placement.platform.service;

import com.placement.platform.domain.Profile;
import com.placement.platform.domain.User;
import com.placement.platform.repository.ProfileRepository;
import com.placement.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

        private final ProfileRepository profileRepository;
        private final UserRepository userRepository;

        public Profile getProfile(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return profileRepository.findByUser(user)
                                .orElseGet(() -> createEmptyProfile(user));
        }

        public Profile updateProfile(String email, Profile updatedProfile) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Profile profile = profileRepository.findByUser(user)
                                .orElseGet(() -> createEmptyProfile(user));

                profile.setResumeUrl(updatedProfile.getResumeUrl());
                profile.setSkills(updatedProfile.getSkills());
                profile.setUniversity(updatedProfile.getUniversity());
                profile.setDegree(updatedProfile.getDegree());
                profile.setGraduationYear(updatedProfile.getGraduationYear());
                profile.setGithubProfile(updatedProfile.getGithubProfile());
                profile.setLinkedinProfile(updatedProfile.getLinkedinProfile());

                return profileRepository.save(profile);
        }

        private Profile createEmptyProfile(User user) {
                Profile profile = Profile.builder()
                                .user(user)
                                .build();
                return profileRepository.save(profile);
        }
}
