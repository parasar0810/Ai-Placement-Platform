package com.placement.platform.repository;

import com.placement.platform.domain.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    Optional<UserProgress> findByUserIdAndQuestionId(UUID userId, UUID questionId);

    List<UserProgress> findByUserId(UUID userId);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user.id = :userId AND up.status = 'SOLVED'")
    long countSolvedByUserId(UUID userId);
}
