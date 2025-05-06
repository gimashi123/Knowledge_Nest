type ChallengeCategory = 'coding' | 'cooking' | 'diy';

export interface Challenge {
    id: string;
    title: string;
    creatorId: string;
    skillCategory: ChallengeCategory;
    difficultyLevel: 'beginner' | 'intermediate' | 'pro';
    tasks: string[];
    timeLimit: number;
    isActive: boolean;
}

export interface ChallengeAttempt {
    id: string;
    challengeId: string;
    userId: string;
    userAnswers: string[];
    score: number;
    submittedInTime: boolean;
    startedAt: string;
    submittedAt: string;
}