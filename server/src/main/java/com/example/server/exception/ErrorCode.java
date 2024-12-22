package com.example.server.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Define enum constants
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Error"),
    INVALID_REQUEST(400, "Invalid request"),
    UNAUTHENTICATED(402, "Unauthenticated"),
    NOT_FOUND(404, "Resource not found"),
    INTERNAL_SERVER_ERROR(500, "Internal server error"),
    PASSWORD_INVALID(501, "Password must be at least 6 characters"),
    USER_EXISTED(505, "This Email has been used"),
    TOKEN_INVALID(506, "This Token is invalid"),
    USER_NOT_EXISTED(503, "This User is not existed");


    private final int code; 
    private final String message; 
}