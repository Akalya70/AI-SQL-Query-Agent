package com.sqlagent.service;

import com.sqlagent.dto.SqlGenerationRequest;
import com.sqlagent.dto.SqlGenerationResponse;
import com.sqlagent.entity.QueryHistory;
import com.sqlagent.repository.QueryHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SqlQueryService {

    private final GeminiService geminiService;
    private final QueryHistoryRepository queryHistoryRepository;

    @Transactional
    public SqlGenerationResponse generateSql(SqlGenerationRequest request) {
        if (request == null || request.getUserInput() == null || request.getUserInput().isBlank()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }

        String normalizedInput = request.getUserInput().trim();
        if (normalizedInput.length() > 1000) {
            throw new IllegalArgumentException("Input cannot exceed 1000 characters");
        }

        String generatedSql = geminiService.generateSql(normalizedInput);

        QueryHistory queryHistory = Objects.requireNonNull(
                QueryHistory.builder()
                        .userInput(normalizedInput)
                        .generatedSql(generatedSql)
                        .build(),
                "Query history entry must be created"
        );

        queryHistoryRepository.save(queryHistory);

        return new SqlGenerationResponse(generatedSql);
    }

    public List<QueryHistory> getHistory() {
        return queryHistoryRepository.findTop10ByOrderByCreatedAtDescIdDesc();
    }
}
