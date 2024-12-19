package com.example.server.model.dto.reponse;

import java.time.LocalDateTime;
import java.util.List;

import com.example.server.model.entity.User;

import lombok.Builder;

@Builder
public record CollectionDto(
    String collectionId,
    User user,
    String name,
    List<String> coffeeIds,
    LocalDateTime createdAt
) {

}
