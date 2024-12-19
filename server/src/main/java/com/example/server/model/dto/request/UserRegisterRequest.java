package com.example.server.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UserRegisterRequest(
    String userName,
    String userEmail,
    @Size(min = 6, message = "PASSWORD_INVALID") 
    String userPassword
) {
}