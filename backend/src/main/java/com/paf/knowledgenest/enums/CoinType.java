package com.paf.knowledgenest.enums;

import lombok.Getter;

@Getter
public enum CoinType {
    POST(10),
    COMMENT(5),
    FOLLOW(3),
    LIKE(1),
    CHALLENGE_CREATION(8),
    CHALLENGE_ATTEMPT(2),
    PROGRESS_COMPLETION(20);

    private final int points;

    CoinType(int points) {
        this.points = points;
    }
}
