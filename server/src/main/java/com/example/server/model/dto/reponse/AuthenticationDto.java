package com.example.server.model.dto.reponse;

import lombok.Builder;

@Builder
public record AuthenticationDto(
    String token,
    boolean authenticated
) {
}
