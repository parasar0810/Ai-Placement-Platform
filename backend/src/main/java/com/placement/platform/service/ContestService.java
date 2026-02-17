package com.placement.platform.service;

import com.placement.platform.domain.Contest;
import com.placement.platform.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestService {

    private final ContestRepository contestRepository;

    public List<Contest> getAllContests() {
        if (contestRepository.count() == 0) {
            seedMockContests();
        }
        return contestRepository.findAll();
    }

    private void seedMockContests() {
        List<Contest> mocks = List.of(
                Contest.builder()
                        .name("Weekly Contest 385")
                        .platform("LeetCode")
                        .link("https://leetcode.com/contest/")
                        .startTime(LocalDateTime.now().plusDays(2))
                        .duration("1.5 Hours")
                        .status("UPCOMING")
                        .build(),
                Contest.builder()
                        .name("Starters 118")
                        .platform("CodeChef")
                        .link("https://www.codechef.com/")
                        .startTime(LocalDateTime.now().plusHours(5))
                        .duration("2 Hours")
                        .status("UPCOMING")
                        .build(),
                Contest.builder()
                        .name("Codeforces Round 999")
                        .platform("Codeforces")
                        .link("https://codeforces.com/")
                        .startTime(LocalDateTime.now().minusHours(1))
                        .duration("2 Hours")
                        .status("ONGOING")
                        .build());
        contestRepository.saveAll(mocks);
    }
}
