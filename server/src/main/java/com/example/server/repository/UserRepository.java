package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User, String>{
    boolean existsByUserEmail(String userEmail);
    Optional<User> findByUserEmail(String userEmail);
}
