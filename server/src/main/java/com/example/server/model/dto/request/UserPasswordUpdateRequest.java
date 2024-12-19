package com.example.server.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;


@Builder
public record UserPasswordUpdateRequest(
    @Size(min = 6, message = "PASSWORD_INVALID")
    String userPassword
) {
}  
