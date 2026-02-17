package com.placement.platform.controller;

import com.placement.platform.domain.Question;
import com.placement.platform.domain.Status;
import com.placement.platform.domain.UserProgress;
import com.placement.platform.service.DsaService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dsa")
@RequiredArgsConstructor
public class DsaController {

    private final DsaService dsaService;

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions(@RequestParam(required = false) String topic) {
        if (topic != null) {
            return ResponseEntity.ok(dsaService.getQuestionsByTopic(topic));
        }
        return ResponseEntity.ok(dsaService.getAllQuestions());
    }

    @PostMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(dsaService.addQuestion(question));
    }

    @PostMapping("/progress")
    public ResponseEntity<UserProgress> updateProgress(
            Authentication authentication,
            @RequestBody UpdateProgressRequest request) {
        return ResponseEntity
                .ok(dsaService.updateProgress(authentication.getName(), request.getQuestionId(), request.getStatus()));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<UserProgress>> getUserProgress(Authentication authentication) {
        return ResponseEntity.ok(dsaService.getUserProgress(authentication.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Long> getSolvedCount(Authentication authentication) {
        return ResponseEntity.ok(dsaService.getSolvedCount(authentication.getName()));
    }

    @Data
    public static class UpdateProgressRequest {
        private UUID questionId;
        private Status status;
    }
}
