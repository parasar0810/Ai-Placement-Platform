package com.placement.platform.service;

import com.placement.platform.domain.Company;
import com.placement.platform.domain.InterviewQuestion;
import com.placement.platform.repository.CompanyRepository;
import com.placement.platform.repository.InterviewQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company addCompany(Company company) {
        return companyRepository.save(company);
    }

    public List<InterviewQuestion> getQuestionsByCompany(UUID companyId) {
        return interviewQuestionRepository.findByCompanyId(companyId);
    }

    public InterviewQuestion addQuestion(InterviewQuestion question) {
        return interviewQuestionRepository.save(question);
    }
}
