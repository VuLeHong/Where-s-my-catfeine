package com.example.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.server.model.dto.reponse.CollectionDto;
import com.example.server.model.dto.request.CollectionCreateRequest;
import com.example.server.model.entity.Collection;

@Mapper(componentModel = "spring")
public interface CollectionMapper {
    
    CollectionDto CollectionDto(Collection collection);

    @Mapping(target = "collectionId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "coffeeIds", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Collection createCollection(CollectionCreateRequest request);
}