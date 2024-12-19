package com.example.server.service;


import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.enums.Role;
import com.example.server.exception.AppException;
import com.example.server.exception.ErrorCode;
import com.example.server.mapper.UserMapper;
import com.example.server.model.dto.reponse.UserDto;
import com.example.server.model.dto.request.UserPasswordUpdateRequest;
import com.example.server.model.dto.request.UserRegisterRequest;
import com.example.server.model.entity.User;
import com.example.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final UserMapper userMapper;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    //register
    public UserDto registerRequest(UserRegisterRequest request){
        if(userRepository.existsByUserEmail(request.userEmail()))
            throw new AppException(ErrorCode.USER_EXISTED);
        User user = userMapper.toUserRegister(request);
        user.setUserPassword(passwordEncoder.encode(request.userPassword()));
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        user.setRoles(roles);
        return userMapper.toUserDto(userRepository.save(user));
    }

    //getAllUser
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<UserDto> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream()
                    .map(userMapper::toUserDto)
                    .toList();
    }

    //getUser
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_USER')")
    public UserDto getUser(String id){
        return userMapper.toUserDto(userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found")));
    }

    //updatePassword
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_USER')")
    public UserDto updatePassword(String userId, UserPasswordUpdateRequest request){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updatePassword(user, request);
        return userMapper.toUserDto(userRepository.save(user));
    }

    //deleteUser
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN')")
    public void deleteUser(String userId){
         userRepository.deleteById(userId);
    }
    

}
