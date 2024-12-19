package com.example.server.model.dto.reponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.example.server.model.entity.Collection;

import lombok.Builder;

@Builder
public record UserDto(
    String userId,
    String userName,
    String userEmail,
    Set<String> roles,
    List<Collection> wishList,
    LocalDateTime createdAt
) {
    
}
