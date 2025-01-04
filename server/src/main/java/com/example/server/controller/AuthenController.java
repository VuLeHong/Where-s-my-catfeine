package com.example.server.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.exception.AppException;
import com.example.server.exception.ErrorCode;
import com.example.server.model.dto.reponse.AuthenticationDto;
import com.example.server.model.dto.reponse.TokenDto;
import com.example.server.model.dto.reponse.VerifyTokenDto;
import com.example.server.model.dto.request.ApiReponse;
import com.example.server.model.dto.request.AuthenticationRequest;
import com.example.server.model.dto.request.LogoutRequest;
import com.example.server.model.dto.request.VerifyTokenRequest;
import com.example.server.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;



@RestController
@RequestMapping("/auth")
public class AuthenController {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/create-token")
    public ApiReponse<String> authenticate(@RequestBody AuthenticationRequest request,  HttpServletResponse response) {

        AuthenticationDto result = authenticationService.authenticate(request);
        Cookie authCookie = new Cookie("Token", result.token());
        authCookie.setHttpOnly(true);
        authCookie.setSecure(true);
        authCookie.setPath("/");  
        authCookie.setMaxAge(1 * 24 * 60 * 60);
        response.addCookie(authCookie);
        response.setHeader("Set-Cookie", "Token=" + result.token() + "; HttpOnly; Secure; Path=/; Max-Age=" + (1 * 24 * 60 * 60) + "; SameSite=None");
        return ApiReponse.<String>builder()
                .message("Success")
                .build();
    }
    
    @PostMapping("/verify")
    public ApiReponse<TokenDto> verifyUser(@RequestBody VerifyTokenRequest request) throws ParseException, JOSEException {
        VerifyTokenDto result = authenticationService.verifyToken(request);
        if(result.Valid() == false){
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }
        TokenDto user = authenticationService.getUserInfo(request);
        return ApiReponse.<TokenDto>builder()
                .result(user)
                .build();
    }
    @PostMapping("/logout")
    public ApiReponse<Void> Logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        
        authenticationService.logout(request);
        return ApiReponse.<Void>builder()
                .build();
    }
    
    
}
