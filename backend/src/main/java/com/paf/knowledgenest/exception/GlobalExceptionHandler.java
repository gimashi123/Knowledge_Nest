package com.paf.knowledgenest.exception;

import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.errorResponse(ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ApiResponse<String>> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.errorResponse(ex.getMessage()));
    }

    @ExceptionHandler(BatchOperationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleBatchOperationException(BatchOperationException ex) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("errors", ex.getErrors());
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.errorResponse("Batch operation failed", errorDetails));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.errorResponse("Validation failed", errors));
    }

    @ExceptionHandler(UncategorizedMongoDbException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<String>> handleMongoDbException(UncategorizedMongoDbException ex) {
        // Log the detailed exception for debugging
        ex.printStackTrace();
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.errorResponse("Database connection error. Please try again later."));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<String>> handleGeneralException(Exception ex) {
        // Log the detailed exception for debugging
        ex.printStackTrace();
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.errorResponse("An unexpected error occurred. Please try again later."));
    }
} 