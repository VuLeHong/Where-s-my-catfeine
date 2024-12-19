package com.example.server.model.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level=AccessLevel.PRIVATE)
@Table(name = "User_data")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
     String userId;

    @Column(nullable = false, length = 100, name = "userName")
     String userName;

    @Column(nullable = false, unique = true, length = 100, name = "userEmail")
     String userEmail;

    @Column(nullable = false, name = "userPassword")
     String userPassword;

    @Column(nullable = false, name = "roles")
     Set<String> roles;

    @Column(nullable = false, updatable = false)
     LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
     List<Collection> wishList;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
