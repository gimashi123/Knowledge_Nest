package com.paf.knowledgenest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class SkillPostException {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String id) {
            super("Skill post not found with id: " + id);
        }
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException() {
            super("You don't have permission to perform this action");
        }
    }
    
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class CommentNotFoundException extends RuntimeException {
        public CommentNotFoundException(String id) {
            super("Comment not found with id: " + id);
        }
    }
    
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class BatchOperationException extends RuntimeException {
        public BatchOperationException(String message) {
            super(message);
        }
    }
    
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public static class DeleteOperationException extends RuntimeException {
        public DeleteOperationException(String message) {
            super(message);
        }
    }
} 