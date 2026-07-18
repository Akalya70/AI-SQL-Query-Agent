package com.sqlagent.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateSql(String userInput) {
        String prompt = """
                You are an SQL Expert.

                Convert the following natural language into a valid MySQL SQL query.

                Rules:
                Return ONLY SQL.
                Do not explain.
                Do not use markdown.
                Do not use code blocks.
                Do not add comments.

                Natural Language:
                """ + userInput;

        String url =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
+ apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

        if (response == null || response.get("candidates") == null) {
            throw new RuntimeException("Gemini API failed to generate a SQL query");
        }

        List<?> candidatesRaw = (List<?>) response.get("candidates");
        if (candidatesRaw == null || candidatesRaw.isEmpty()) {
            throw new RuntimeException("Gemini API returned no candidates");
        }

        Map<String, Object> candidate = asMap(candidatesRaw.get(0));
        Map<String, Object> contentMap = asMap(candidate.get("content"));
        List<?> partsRaw = (List<?>) contentMap.get("parts");
        if (partsRaw == null || partsRaw.isEmpty()) {
            throw new RuntimeException("Gemini API returned no content parts");
        }

        Map<String, Object> firstPart = asMap(partsRaw.get(0));
        String sql = asString(firstPart.get("text")).trim();

        if (sql.isBlank()) {
            throw new RuntimeException("Gemini returned an empty response");
        }

        return sql;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        throw new RuntimeException("Unexpected Gemini API response structure");
    }

    private String asString(Object value) {
        if (value instanceof String text) {
            return text;
        }
        throw new RuntimeException("Unexpected Gemini API response content");
    }
}
