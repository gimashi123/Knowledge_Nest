import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/challenge/Timer';
import { Challenge } from '@/types/challenge';
import { api } from '@/lib/api';
import { ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface ValidationResult {
    score: number;
    totalQuestions: number;
    feedback: string;
    answers: Array<{
        correct: boolean;
        feedback: string;
    }>;
}

export default function ChallengeAttemptPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedTask, setExpandedTask] = useState<number | null>(null);
    const [showResultsDialog, setShowResultsDialog] = useState(false);
    const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
    const [coinsEarned, setCoinsEarned] = useState(0);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await api.get(`/api/challenges/${id}`);
                const fetchedChallenge = response.data;

                if (!Array.isArray(fetchedChallenge.tasks)) {
                    fetchedChallenge.tasks = [];
                }

                setChallenge(fetchedChallenge);
                setStartTime(new Date());
                setExpandedTask(0);
            } catch (error) {
                console.error('Error fetching challenge:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [id]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const toggleTask = (index: number) => {
        setExpandedTask(expandedTask === index ? null : index);
    };

    const validateAnswers = (): void => {
        if (!challenge) return;

        let score = 0;
        const totalQuestions = challenge.tasks.length;
        
        // First, validate all answers and calculate score
        const validatedAnswers = challenge.tasks.map((_task: string, index: number) => {
            const answer = answers[index].trim();
            // This is a simple validation - you should replace this with your actual validation logic
            const isCorrect: boolean = answer.length > 0;
            const feedback = isCorrect 
                ? "Good answer!" 
                : "Please provide an answer for this question.";

            if (isCorrect) score++;
            return { correct: isCorrect, feedback };
        });

        // Calculate coins earned (10 coins per correct answer)
        const earnedCoins = score * 10;
        setCoinsEarned(earnedCoins);

        // Generate overall feedback based on score
        const percentage = (score / totalQuestions) * 100;
        let feedback = '';
        
        if (percentage === 100) {
            feedback = "Perfect! You've answered all questions correctly!";
        } else if (percentage >= 80) {
            feedback = "Great job! You've answered most questions correctly.";
        } else if (percentage >= 60) {
            feedback = "Good effort! You've answered more than half correctly.";
        } else {
            feedback = "Keep practicing! You can do better next time.";
        }

        // Create the final results object
        const results: ValidationResult = {
            score,
            totalQuestions,
            feedback,
            answers: validatedAnswers
        };

        setValidationResults(results);
        setShowResultsDialog(true);
    };

    const handleSubmit = () => {
        setShowResultsDialog(false);
        navigate('/challenges');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading challenge...</p>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Challenge not found</h3>
                    <p className="text-gray-600 mb-6">The challenge you're looking for doesn't exist or has been removed.</p>
                    <Button 
                        onClick={() => navigate('/challenges')}
                        className="bg-[#44468f] hover:bg-[#3a3d7a] text-white"
                    >
                        Back to Challenges
                    </Button>
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
                            <p className="text-gray-600 mt-1">Test your skills with this timed challenge</p>
                        </div>
                        {startTime && (
                            <div className="bg-red-50 px-6 py-3 rounded-lg border border-red-200 flex items-center gap-3">
                                <Clock className="h-5 w-5 text-red-600" />
                                <Timer
                                    initialMinutes={challenge.timeLimit}
                                    onComplete={validateAnswers}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Main Content (Left Side) */}
                    <div className="md:w-2/3">
                        {/* Tasks Section */}
                        <div className="space-y-4">
                            {Array.isArray(challenge.tasks) &&
                                challenge.tasks.map((task, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                                        <button
                                            type="button"
                                            className="w-full text-left"
                                            onClick={() => toggleTask(index)}
                                        >
                                            <CardHeader className="bg-gray-50 border-b">
                                                <CardTitle className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <span className="bg-[#44468f] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-900">Task {index + 1}</span>
                                                    </div>
                                                    {expandedTask === index ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </button>

                                        {expandedTask === index && (
                                            <CardContent className="p-6 animate-in fade-in">
                                                <p className="mb-4 text-gray-700">{task}</p>
                                                <textarea
                                                    className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#44468f] focus:border-[#44468f] transition-all bg-gray-50"
                                                    placeholder="Type your answer here..."
                                                    value={answers[index]}
                                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                />
                                                <div className="flex justify-between items-center mt-3">
                                                    <div className="text-sm text-gray-500">
                                                        Character count: {answers[index].length}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="text-sm text-[#44468f] hover:text-[#3a3d7a] font-medium"
                                                        onClick={() => toggleTask(index)}
                                                    >
                                                        Collapse task
                                                    </button>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={validateAnswers}
                                className="px-8 py-4 text-lg bg-[#44468f] hover:bg-[#3a3d7a] text-white transition-colors shadow-md"
                            >
                                Submit Challenge
                            </Button>
                        </div>
                    </div>

                    {/* Instructions Sidebar */}
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h2 className="font-semibold text-[#44468f] mb-4 text-xl">Instructions</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="bg-[#44468f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                                    <span className="text-gray-700">Click on each task header to expand/collapse it</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[#44468f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                                    <span className="text-gray-700">You have {challenge.timeLimit} minutes to complete all tasks</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[#44468f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                                    <span className="text-gray-700">Answer all questions to the best of your ability</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[#44468f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                                    <span className="text-gray-700">Timer will auto-submit when time expires</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-[#44468f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
                                    <span className="text-gray-700">You can submit early using the button</span>
                                </li>
                            </ul>

                            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-2">Tips</h3>
                                <p className="text-sm text-gray-600">
                                    Focus on one task at a time. Collapse completed tasks to reduce clutter and focus on remaining ones.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Dialog */}
            <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-xl font-bold text-center text-gray-900">
                            Challenge Results
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600 text-sm">
                            Here's how you did on the challenge
                        </DialogDescription>
                    </DialogHeader>

                    {validationResults && (
                        <div className="py-4">
                            {/* Score Display */}
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#44468f]/10 mb-3">
                                    <Trophy className="w-8 h-8 text-[#44468f]" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {validationResults.score}/{validationResults.totalQuestions}
                                </h3>
                                <p className="text-base text-gray-600">{validationResults.feedback}</p>
                                {coinsEarned > 0 && (
                                    <div className="mt-2 text-sm font-medium text-amber-600">
                                        +{coinsEarned} coins earned!
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <Progress
                                    value={(validationResults.score / validationResults.totalQuestions) * 100}
                                    className="h-1.5"
                                />
                            </div>

                            {/* Detailed Results */}
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                {validationResults.answers.map((result, index) => (
                                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                                        {result.correct ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">Question {index + 1}</p>
                                            <p className="text-xs text-gray-600">{result.feedback}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <Button
                            onClick={handleSubmit}
                            className="w-full h-9 bg-[#44468f] hover:bg-[#3a3d7a] text-white"
                        >
                            {coinsEarned > 0 ? `Add ${coinsEarned} Coins` : 'Complete Challenge'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
