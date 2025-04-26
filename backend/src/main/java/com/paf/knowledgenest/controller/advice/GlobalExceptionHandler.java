package com.paf.knowledgenest.controller.advice;

import com.paf.knowledgenest.dto.ApiResponseDto;
import com.paf.knowledgenest.exception.SkillPostException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SkillPostException.NotFoundException.class)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> handleNotFoundException(
            SkillPostException.NotFoundException ex, WebRequest request) {
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("error", "Post not found");
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", LocalDateTime.now().toString());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponseDto.failure(errorData, ex.getMessage()));
    }

    @ExceptionHandler(SkillPostException.UnauthorizedException.class)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> handleUnauthorizedException(
            SkillPostException.UnauthorizedException ex, WebRequest request) {
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("error", "Unauthorized");
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", LocalDateTime.now().toString());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponseDto.failure(errorData, ex.getMessage()));
    }

    @ExceptionHandler(SkillPostException.CommentNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> handleCommentNotFoundException(
            SkillPostException.CommentNotFoundException ex, WebRequest request) {
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("error", "Comment not found");
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", LocalDateTime.now().toString());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponseDto.failure(errorData, ex.getMessage()));
    }

    @ExceptionHandler(SkillPostException.BatchOperationException.class)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> handleBatchOperationException(
            SkillPostException.BatchOperationException ex, WebRequest request) {
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("error", "Batch operation failed");
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", LocalDateTime.now().toString());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseDto.failure(errorData, ex.getMessage()));
    }

    @ExceptionHandler(SkillPostException.DeleteOperationException.class)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> handleDeleteOperationException(
            SkillPostException.DeleteOperationException ex, WebRequest request) {
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("error", "Delete operation failed");
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", LocalDateTime.now().toString());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.failure(errorData, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> handleGlobalException(
            Exception ex, WebRequest request) {
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("error", "Server error");
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", LocalDateTime.now().toString());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.failure(errorData, "An unexpected error occurred"));
    }
} 