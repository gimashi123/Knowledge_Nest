package com.paf.knowledgenest.utils;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T result;

    public static <T> ApiResponse<T> successResponse(String message, T result) {
            ApiResponse<T> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage(message);
            response.setResult(result);
            return response;
        }

        public static <T> ApiResponse<T> errorResponse(String message) {
            ApiResponse<T> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage(message);
            response.setResult(null);
            return response;
        }
        
        public static <T> ApiResponse<T> errorResponse(String message, T errorDetails) {
            ApiResponse<T> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage(message);
            response.setResult(errorDetails);
            return response;
        }
}