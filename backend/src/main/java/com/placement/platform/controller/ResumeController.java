package com.placement.platform.controller;

import com.placement.platform.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class ResumeController {

    private final AiService aiService;

    @PostMapping("/resume/analyze")
    public ResponseEntity<Map<String, Object>> analyzeResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        // In a real app, parse PDF/Docx using Apache PDFBox or similar.
        // For this demo, we'll simulate text extraction or just read plain text if
        // possible.
        String dummyContent = "Sample resume content for user " + authentication.getName();

        Map<String, Object> analysis = aiService.analyzeResume(dummyContent);
        return ResponseEntity.ok(analysis);
    }
}
