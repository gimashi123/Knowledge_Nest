package com.paf.knowledgenest.model;

import lombok.Data;

@Data
public class Task {
    private String question;
    private String correctAnswer;
    private int points;
}
