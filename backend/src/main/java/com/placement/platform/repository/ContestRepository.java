package com.placement.platform.repository;

import com.placement.platform.domain.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ContestRepository extends JpaRepository<Contest, UUID> {
}
