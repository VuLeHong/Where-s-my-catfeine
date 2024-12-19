package com.example.server.model.dto.reponse;

import lombok.Builder;

@Builder
public record VerifyTokenDto(
    Boolean Valid
) {
    
}
