package com.paf.knowledgenest.exception;

public class SkillPostException extends RuntimeException {
    
    public SkillPostException(String message) {
        super(message);
    }
    
    public static class NotFoundException extends SkillPostException {
        public NotFoundException(String id) {
            super("Skill post not found with id: " + id);
        }
    }
    
    public static class UnauthorizedException extends SkillPostException {
        public UnauthorizedException() {
            super("You are not authorized to perform this action");
        }
    }
} 