package com.example.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.server.model.dto.reponse.UserDto;
import com.example.server.model.dto.request.UserPasswordUpdateRequest;
import com.example.server.model.dto.request.UserRegisterRequest;
import com.example.server.model.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "wishList", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toUserRegister(UserRegisterRequest request);
    
    UserDto toUserDto(User user);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "userName", ignore = true)
    @Mapping(target = "userEmail", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "wishList", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updatePassword(@MappingTarget User user, UserPasswordUpdateRequest request);
}