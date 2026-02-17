package com.placement.platform.controller;

import com.placement.platform.domain.Company;
import com.placement.platform.domain.InterviewQuestion;
import com.placement.platform.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping
    public ResponseEntity<Company> addCompany(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.addCompany(company));
    }

    @GetMapping("/{companyId}/questions")
    public ResponseEntity<List<InterviewQuestion>> getQuestionsByCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(companyService.getQuestionsByCompany(companyId));
    }

    @PostMapping("/{companyId}/questions")
    public ResponseEntity<InterviewQuestion> addQuestion(@PathVariable UUID companyId,
            @RequestBody InterviewQuestion question) {
        // Fetch company by ID first in a real app to ensure existence
        Company company = Company.builder().id(companyId).build();
        question.setCompany(company);
        return ResponseEntity.ok(companyService.addQuestion(question));
    }
}
