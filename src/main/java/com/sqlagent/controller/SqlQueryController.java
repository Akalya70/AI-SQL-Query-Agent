package com.sqlagent.controller;

import com.sqlagent.dto.SqlGenerationRequest;
import com.sqlagent.dto.SqlGenerationResponse;
import com.sqlagent.entity.QueryHistory;
import com.sqlagent.service.SqlQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SqlQueryController {

    private final SqlQueryService sqlQueryService;

    @PostMapping("/sql/generate")
    public ResponseEntity<SqlGenerationResponse> generateSql(@Valid @RequestBody SqlGenerationRequest request) {
        SqlGenerationResponse response = sqlQueryService.generateSql(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<QueryHistory>> getHistory() {
        return ResponseEntity.ok(sqlQueryService.getHistory());
    }
}
