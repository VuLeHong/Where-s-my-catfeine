package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.model.dto.reponse.CollectionDto;
import com.example.server.model.dto.reponse.UserDto;
import com.example.server.model.dto.request.CoffeeAddRequest;
import com.example.server.model.dto.request.CoffeeIdDeleteRequest;
import com.example.server.model.dto.request.CollectionCreateRequest;
import com.example.server.service.CollectionService;

import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/collection")
@Slf4j
public class CollectionController {
    @Autowired
    private CollectionService collectionService;

    @PostMapping("/create/{userId}")
    public UserDto createCollection(@PathVariable("userId") String userId, @RequestBody CollectionCreateRequest request) {
        return collectionService.createCollection(userId, request);
    }
    
    @PostMapping("/add-coffee/{collectionId}")
    public CollectionDto addCoffeeId(@PathVariable("collectionId") String collectionId, @RequestBody CoffeeAddRequest request) {
        return collectionService.addCoffeeId(collectionId, request);
    }
    
    @DeleteMapping("/delete-coffee/{collectionId}")
    public CollectionDto deleteCoffeeId(@PathVariable("collectionId") String collectionId, @RequestBody CoffeeIdDeleteRequest request) {
        return collectionService.deleteCoffeeId(collectionId, request);
    }

    @DeleteMapping("/delete/{collectionId}")
    public String deleteCollection(@PathVariable("collectionId") String collectionId) {
         collectionService.deleteCollection(collectionId);
         return "Collection has been deleted";
    }

}
