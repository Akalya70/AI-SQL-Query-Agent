package com.sqlagent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SqlGenerationRequest {

    @NotBlank(message = "Input cannot be empty")
    @Size(max = 1000, message = "Input cannot exceed 1000 characters")
    private String userInput;
}
