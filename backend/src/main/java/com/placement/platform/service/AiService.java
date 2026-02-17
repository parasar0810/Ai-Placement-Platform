package com.placement.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${ai.openai.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeResume(String resumeText) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            return getMockAnalysis();
        }

        try {
            return callOpenAi(resumeText);
        } catch (Exception e) {
            e.printStackTrace();
            return getMockAnalysis(); // Fallback to mock on error
        }
    }

    private Map<String, Object> callOpenAi(String text) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build JSON using Map to avoid manual string manipulation or org.json
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content",
                "Analyze this resume content and provide a JSON response with fields: score (0-100), keySkills (list), improvements (list), and summary. Content: "
                        + text.substring(0, Math.min(text.length(), 2000)));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", java.util.List.of(userMessage));

        String jsonRequest = objectMapper.writeValueAsString(requestBody);

        HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        JsonNode rootNode = objectMapper.readTree(response.getBody());
        String content = rootNode.path("choices").get(0).path("message").path("content").asText();

        // Naive parsing assuming AI returns JSON string
        Map<String, Object> result = new HashMap<>();
        try {
            // Try to parse the content as JSON if AI returned JSON
            result = objectMapper.readValue(content, Map.class);
        } catch (Exception e) {
            result.put("raw_analysis", content);
            result.put("score", 75);
            result.put("summary", content);
            result.put("keySkills", java.util.List.of("Parsed from AI"));
            result.put("improvements", java.util.List.of("Check raw analysis"));
        }
        return result;
    }

    private Map<String, Object> getMockAnalysis() {
        Map<String, Object> mock = new HashMap<>();
        mock.put("score", 85);
        mock.put("summary", "Strong profile with good academic background. Recommended to add more projects.");
        mock.put("keySkills", java.util.List.of("Java", "Spring Boot", "React", "SQL"));
        mock.put("improvements", java.util.List.of(
                "Add GitHub project links",
                "Quantify achievements in internships",
                "Include certifications"));
        mock.put("isMock", true);
        return mock;
    }

    public Map<String, Object> chat(String message) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            return getMockChat(message);
        }

        try {
            return callOpenAiChat(message);
        } catch (Exception e) {
            e.printStackTrace();
            return getMockChat(message);
        }
    }

    private Map<String, Object> callOpenAiChat(String message) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", message);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", java.util.List.of(userMessage));

        String jsonRequest = objectMapper.writeValueAsString(requestBody);
        HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        JsonNode rootNode = objectMapper.readTree(response.getBody());
        String content = rootNode.path("choices").get(0).path("message").path("content").asText();

        Map<String, Object> result = new HashMap<>();
        result.put("message", content);
        return result;
    }

    private Map<String, Object> getMockChat(String message) {
        Map<String, Object> mock = new HashMap<>();
        String response = "I'm a mock AI assistant. You said: \"" + message
                + "\". (Add an API Key to get real responses!)";

        if (message.toLowerCase().contains("resume")) {
            response = "To analyze your resume, please upload it in the Dashboard's 'AI Resume Analyzer' section.";
        } else if (message.toLowerCase().contains("interview")) {
            response = "For interview prep, check out the 'Interviews' tab to see questions from top companies.";
        }

        mock.put("message", response);
        mock.put("isMock", true);
        return mock;
    }

    public Map<String, Object> getContestRecommendations(String query) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            return getMockContestRecommendations(query);
        }

        try {
            return callOpenAiContestSearch(query);
        } catch (Exception e) {
            e.printStackTrace();
            return getMockContestRecommendations(query);
        }
    }

    private Map<String, Object> callOpenAiContestSearch(String query) throws Exception {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content",
                "Recommend 3-5 coding contests (platform, name, link) for a user interested in: " + query
                        + ". Return ONLY a JSON object with a 'recommendations' key containing a list of objects with fields: 'name', 'platform', 'link', 'description'.");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", java.util.List.of(userMessage));

        String jsonRequest = objectMapper.writeValueAsString(requestBody);
        HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        JsonNode rootNode = objectMapper.readTree(response.getBody());
        String content = rootNode.path("choices").get(0).path("message").path("content").asText();

        try {
            return objectMapper.readValue(content, Map.class);
        } catch (Exception e) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("recommendations", java.util.List.of());
            fallback.put("raw", content);
            return fallback;
        }
    }

    private Map<String, Object> getMockContestRecommendations(String query) {
        Map<String, Object> mock = new HashMap<>();
        var recs = java.util.List.of(
                Map.of(
                        "name", "Weekly Contest (Mock)",
                        "platform", "LeetCode",
                        "link", "https://leetcode.com/contest/",
                        "description", "Standard algorithm contest perfect for " + query),
                Map.of(
                        "name", "Starters (Mock)",
                        "platform", "CodeChef",
                        "link", "https://www.codechef.com/",
                        "description", "Beginner friendly contest for " + query),
                Map.of(
                        "name", "Div 3 Round (Mock)",
                        "platform", "Codeforces",
                        "link", "https://codeforces.com/",
                        "description", "Competitive programming round suitable for " + query));
        mock.put("recommendations", recs);
        mock.put("isMock", true);
        return mock;
    }
}
