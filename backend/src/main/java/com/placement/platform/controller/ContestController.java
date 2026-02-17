package com.placement.platform.controller;

import com.placement.platform.domain.Contest;
import com.placement.platform.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import com.placement.platform.service.AiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contests")
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;
    private final AiService aiService;

    @GetMapping
    public ResponseEntity<List<Contest>> getContests() {
        return ResponseEntity.ok(contestService.getAllContests());
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchContests(@RequestParam String query) {
        return ResponseEntity.ok(aiService.getContestRecommendations(query));
    }
}
