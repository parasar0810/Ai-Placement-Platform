package com.placement.platform.service;

import com.placement.platform.domain.Question;
import com.placement.platform.domain.Status;
import com.placement.platform.domain.User;
import com.placement.platform.domain.UserProgress;
import com.placement.platform.repository.QuestionRepository;
import com.placement.platform.repository.UserProgressRepository;
import com.placement.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DsaService {

    private final QuestionRepository questionRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByTopic(String topic) {
        return questionRepository.findByTopic(topic);
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Transactional
    public UserProgress updateProgress(String userEmail, UUID questionId, Status status) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        UserProgress progress = userProgressRepository.findByUserIdAndQuestionId(user.getId(), questionId)
                .orElse(UserProgress.builder()
                        .user(user)
                        .question(question)
                        .build());

        progress.setStatus(status);
        return userProgressRepository.save(progress);
    }

    public List<UserProgress> getUserProgress(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProgressRepository.findByUserId(user.getId());
    }

    public long getSolvedCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProgressRepository.countSolvedByUserId(user.getId());
    }
}
