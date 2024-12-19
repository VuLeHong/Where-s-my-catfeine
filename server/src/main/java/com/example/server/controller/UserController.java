package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.model.dto.reponse.UserDto;
import com.example.server.model.dto.request.ApiReponse;
import com.example.server.model.dto.request.UserPasswordUpdateRequest;
import com.example.server.model.dto.request.UserRegisterRequest;
import com.example.server.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;

    @SuppressWarnings("unchecked")
    @PostMapping("/register")
    public ApiReponse<UserDto> userRegister(@RequestBody @Valid UserRegisterRequest request) {

        @SuppressWarnings("rawtypes")
        ApiReponse apiReponse = new ApiReponse<>();
        apiReponse.setResult(userService.registerRequest(request));
        return apiReponse;
    }

    
    @GetMapping("/get-all")
    public List<UserDto> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getAllUsers();
    }
    
    @GetMapping("/get/{userId}")
    public UserDto getMethodName(@PathVariable("userId") String userId) {
        return userService.getUser(userId);
    }
    
    @PutMapping("/update/{userId}")
    public UserDto updatePassword(@PathVariable("userId") String userId, @RequestBody UserPasswordUpdateRequest request) {
        return userService.updatePassword(userId, request);
    }
    
    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId); 
        return "User has been deleted";
    }
    
}
