package com.placement.platform.config;

import com.placement.platform.domain.Difficulty;
import com.placement.platform.domain.Question;
import com.placement.platform.domain.Company;
import com.placement.platform.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

        private final QuestionRepository questionRepository;
        private final com.placement.platform.repository.CompanyRepository companyRepository;
        private final com.placement.platform.repository.InterviewQuestionRepository interviewQuestionRepository;

        @Override
        public void run(String... args) throws Exception {
                loadDsaQuestions();
                loadCompanyQuestions();
        }

        private void loadDsaQuestions() {
                if (questionRepository.count() == 0) {
                        List<Question> questions = List.of(
                                        Question.builder()
                                                        .title("Two Sum")
                                                        .topic("Arrays")
                                                        .difficulty(Difficulty.EASY)
                                                        .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.")
                                                        .link("https://leetcode.com/problems/two-sum/")
                                                        .build(),
                                        Question.builder()
                                                        .title("Reverse Linked List")
                                                        .topic("LinkedList")
                                                        .difficulty(Difficulty.EASY)
                                                        .description("Given the head of a singly linked list, reverse the list, and return the reversed list.")
                                                        .link("https://leetcode.com/problems/reverse-linked-list/")
                                                        .build(),
                                        Question.builder()
                                                        .title("Longest Substring Without Repeating Characters")
                                                        .topic("Strings")
                                                        .difficulty(Difficulty.MEDIUM)
                                                        .description("Given a string s, find the length of the longest substring without repeating characters.")
                                                        .link("https://leetcode.com/problems/longest-substring-without-repeating-characters/")
                                                        .build());
                        questionRepository.saveAll(questions);
                        System.out.println("Data loaded: " + questions.size() + " questions.");
                }
        }

        private void loadCompanyQuestions() {
                if (companyRepository.count() == 0) {
                        Company google = Company.builder().name("Google").industry("Tech")
                                        .description("Technology giant.").build();
                        Company amazon = Company.builder().name("Amazon").industry("E-commerce")
                                        .description("E-commerce and cloud computing.").build();

                        companyRepository.saveAll(List.of(google, amazon));

                        List<com.placement.platform.domain.InterviewQuestion> questions = List.of(
                                        com.placement.platform.domain.InterviewQuestion.builder()
                                                        .title("Invert Binary Tree")
                                                        .description("Invert a binary tree.")
                                                        .difficulty(Difficulty.EASY)
                                                        .frequency("High")
                                                        .company(google)
                                                        .build(),
                                        com.placement.platform.domain.InterviewQuestion.builder()
                                                        .title("LRU Cache")
                                                        .description("Design a data structure for LRU Cache.")
                                                        .difficulty(Difficulty.HARD)
                                                        .frequency("High")
                                                        .company(amazon)
                                                        .build());
                        interviewQuestionRepository.saveAll(questions);
                        System.out.println("Data loaded: Companies and Interview Questions.");
                }
        }
}
