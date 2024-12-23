package com.example.server.model.dto.request;

import lombok.Builder;

@Builder
public record LogoutRequest(
    String token
) {

}
