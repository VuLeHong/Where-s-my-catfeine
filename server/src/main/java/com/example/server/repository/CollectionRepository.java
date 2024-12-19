package com.example.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.entity.Collection;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, String> {

}
