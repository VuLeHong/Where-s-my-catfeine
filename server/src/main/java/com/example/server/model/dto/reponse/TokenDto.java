package com.example.server.model.dto.reponse;

import lombok.Builder;

@Builder
public record TokenDto(
    String userEmail,
    String userId,
    String role
) {

}
