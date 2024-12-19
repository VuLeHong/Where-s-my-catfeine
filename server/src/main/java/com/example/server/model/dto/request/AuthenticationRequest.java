package com.example.server.model.dto.request;

import lombok.Builder;

@Builder
public record AuthenticationRequest(
    String userEmail,
    String userPassword
) {

}
