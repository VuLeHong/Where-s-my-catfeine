package com.example.server.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.example.server.mapper.CollectionMapper;
import com.example.server.mapper.UserMapper;
import com.example.server.model.dto.reponse.CollectionDto;
import com.example.server.model.dto.reponse.UserDto;
import com.example.server.model.dto.request.CoffeeAddRequest;
import com.example.server.model.dto.request.CoffeeIdDeleteRequest;
import com.example.server.model.dto.request.CollectionCreateRequest;
import com.example.server.model.entity.Collection;
import com.example.server.model.entity.User;
import com.example.server.repository.CollectionRepository;
import com.example.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollectionService {
    @Autowired
    private final CollectionRepository collectionRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final CollectionMapper collectionMapper;

    @Autowired
    private final UserMapper userMapper;
    //createCollection
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_USER')")
    public UserDto createCollection(String userId, CollectionCreateRequest request){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Collection collection = collectionMapper.createCollection(request);
        collection.setUser(user);
        collectionRepository.save(collection);
        List<Collection> wishList = user.getWishList();
        wishList.add(collection);
        user.setWishList(wishList);
        return userMapper.toUserDto(userRepository.save(user));
    }

    //addCoffe
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_USER')")
    public CollectionDto addCoffeeId(String collectionId, CoffeeAddRequest request){
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new RuntimeException("Collection not found"));
        List<String> CoffeeIds = collection.getCoffeeIds(); 
        CoffeeIds.add(request.coffeeId());
        collection.setCoffeeIds(CoffeeIds);
        return collectionMapper.CollectionDto(collectionRepository.save(collection));
    }

    //deletecollection
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_USER')")
    public void deleteCollection(String collectionId){
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new RuntimeException("Collection not found"));
        User user = collection.getUser();
        user.getWishList().remove(collection);
        userRepository.save(user);
        collectionRepository.deleteById(collectionId);
    }

    //deleteCoffeeId
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_USER')")
    public CollectionDto deleteCoffeeId(String collectionId, CoffeeIdDeleteRequest request){
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new RuntimeException("Collection not found"));
        List<String> CoffeeIds = collection.getCoffeeIds();
        CoffeeIds.remove(request.coffeeId());
        collection.setCoffeeIds(CoffeeIds);
        return collectionMapper.CollectionDto(collectionRepository.save(collection));
    }
}
