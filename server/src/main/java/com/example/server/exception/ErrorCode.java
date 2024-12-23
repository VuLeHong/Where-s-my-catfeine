package com.example.server.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Define enum constants
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(400, "Invalid request", HttpStatus.BAD_REQUEST),
    WRONG_PASSWORD(402, "wrong password", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(402, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    NOT_FOUND(404, "Resource not found", HttpStatus.NOT_FOUND),
    INTERNAL_SERVER_ERROR(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    PASSWORD_INVALID(501, "Password must be at least 6 characters", HttpStatus.BAD_REQUEST),
    USER_EXISTED(505, "This Email has been used", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID(506, "This Token is invalid", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(503, "This User is not existed", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(507, "You do not have permission", HttpStatus.FORBIDDEN),
    ;



    private final int code; 
    private final String message; 
    private final HttpStatus statusCode;
}