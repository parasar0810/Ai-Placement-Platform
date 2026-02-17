package com.placement.platform.repository;

import com.placement.platform.domain.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, UUID> {
    List<InterviewQuestion> findByCompanyId(UUID companyId);
}
