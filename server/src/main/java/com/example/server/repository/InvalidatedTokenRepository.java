package com.example.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.server.model.entity.InvalidToken;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidToken, String> {
    
}
