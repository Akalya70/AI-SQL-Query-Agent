package com.sqlagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SqlGenerationResponse {
    private String generatedSql;
}
