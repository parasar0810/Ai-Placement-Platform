package com.placement.platform.repository;

import com.placement.platform.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findByUser(com.placement.platform.domain.User user);
}
